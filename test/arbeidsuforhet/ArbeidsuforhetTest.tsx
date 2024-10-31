import { QueryClient } from "@tanstack/react-query";
import React from "react";
import { queryClientWithMockData } from "../testQueryClient";
import { ARBEIDSTAKER_DEFAULT } from "@/mocks/common/mockConstants";
import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import {
  VurderingArsak,
  VurderingResponseDTO,
  VurderingType,
} from "@/data/arbeidsuforhet/arbeidsuforhetTypes";
import { arbeidsuforhetQueryKeys } from "@/data/arbeidsuforhet/arbeidsuforhetQueryHooks";
import {
  createForhandsvarsel,
  createVurdering,
} from "./arbeidsuforhetTestData";
import { Arbeidsuforhet } from "@/sider/arbeidsuforhet/Arbeidsuforhet";
import { arbeidsuforhetPath } from "@/routers/AppRouter";
import { renderArbeidsuforhetSide } from "./arbeidsuforhetTestUtils";
import { addWeeks } from "@/utils/datoUtils";
import { clickButton } from "../testUtils";

let queryClient: QueryClient;

const mockArbeidsuforhetVurderinger = (vurderinger: VurderingResponseDTO[]) => {
  queryClient.setQueryData(
    arbeidsuforhetQueryKeys.arbeidsuforhet(ARBEIDSTAKER_DEFAULT.personIdent),
    () => vurderinger
  );
};

describe("ArbeidsuforhetSide", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  describe("Send forhåndsvarsel and Oppfylt buttons", () => {
    const sendForhandsvarselButtonText = "Send forhåndsvarsel";
    const oppfyltButtonText = "Oppfylt";

    it("is shown if there are no vurderinger", () => {
      const vurderinger = [];
      mockArbeidsuforhetVurderinger(vurderinger);

      renderArbeidsuforhetSide(
        queryClient,
        <Arbeidsuforhet />,
        arbeidsuforhetPath,
        [arbeidsuforhetPath]
      );

      expect(screen.getByText("Siste vurdering")).to.exist;
      expect(screen.getByRole("button", { name: sendForhandsvarselButtonText }))
        .to.exist;
      expect(screen.getByRole("button", { name: oppfyltButtonText })).to.exist;
    });

    it("is shown if latest arbeidsuforhet status is oppfylt", () => {
      const oppfyltVurdering = createVurdering({
        type: VurderingType.OPPFYLT,
        begrunnelse: "begrunnelse",
        createdAt: new Date(),
      });
      const vurderinger = [oppfyltVurdering];
      mockArbeidsuforhetVurderinger(vurderinger);

      renderArbeidsuforhetSide(
        queryClient,
        <Arbeidsuforhet />,
        arbeidsuforhetPath,
        [arbeidsuforhetPath]
      );

      expect(screen.getByText("Siste vurdering")).to.exist;
      expect(screen.getByText(/Oppfylt den/)).to.exist;
      expect(screen.getByRole("button", { name: sendForhandsvarselButtonText }))
        .to.exist;
      expect(screen.getByRole("button", { name: oppfyltButtonText })).to.exist;
    });

    it("is shown if status is avslag", () => {
      const avslag = createVurdering({
        type: VurderingType.AVSLAG,
        begrunnelse: "",
        createdAt: new Date(),
      });
      const vurderinger = [avslag];
      mockArbeidsuforhetVurderinger(vurderinger);

      renderArbeidsuforhetSide(
        queryClient,
        <Arbeidsuforhet />,
        arbeidsuforhetPath,
        [arbeidsuforhetPath]
      );

      expect(screen.getByText("Siste vurdering")).to.exist;
      expect(screen.getByText(/Avslag/)).to.exist;
      expect(screen.getByRole("button", { name: sendForhandsvarselButtonText }))
        .to.exist;
      expect(screen.getByRole("button", { name: oppfyltButtonText })).to.exist;
    });

    it("is shown if status is ikke aktuell", () => {
      const ikkeAktuell = createVurdering({
        type: VurderingType.IKKE_AKTUELL,
        begrunnelse: "",
        arsak: VurderingArsak.FRISKMELDT,
        createdAt: new Date(),
      });
      const vurderinger = [ikkeAktuell];
      mockArbeidsuforhetVurderinger(vurderinger);

      renderArbeidsuforhetSide(
        queryClient,
        <Arbeidsuforhet />,
        arbeidsuforhetPath,
        [arbeidsuforhetPath]
      );

      expect(screen.getByText("Siste vurdering")).to.exist;
      expect(screen.getByText(/Ikke aktuell/)).to.exist;
      expect(screen.getByRole("button", { name: sendForhandsvarselButtonText }))
        .to.exist;
      expect(screen.getByRole("button", { name: oppfyltButtonText })).to.exist;
    });

    it("is not shown if status is forhåndsvarsel", () => {
      const vurderinger = [
        createForhandsvarsel({
          createdAt: new Date(),
          svarfrist: addWeeks(new Date(), 3),
        }),
      ];
      mockArbeidsuforhetVurderinger(vurderinger);

      renderArbeidsuforhetSide(
        queryClient,
        <Arbeidsuforhet />,
        arbeidsuforhetPath,
        [arbeidsuforhetPath]
      );

      expect(screen.queryByText("Siste vurdering")).to.not.exist;
      expect(
        screen.queryByRole("button", { name: sendForhandsvarselButtonText })
      ).to.not.exist;
      expect(screen.queryByRole("button", { name: oppfyltButtonText })).to.not
        .exist;
    });

    it("is not shown after clicking Send forhåndsvarsel", async () => {
      renderArbeidsuforhetSide(
        queryClient,
        <Arbeidsuforhet />,
        arbeidsuforhetPath,
        [arbeidsuforhetPath]
      );

      await clickButton(sendForhandsvarselButtonText);

      expect(screen.queryByText("Siste vurdering")).to.not.exist;
      expect(
        screen.queryByRole("button", { name: sendForhandsvarselButtonText })
      ).to.not.exist;
      expect(screen.queryByRole("button", { name: oppfyltButtonText })).to.not
        .exist;
    });

    it("is not shown after clicking Oppfylt", async () => {
      renderArbeidsuforhetSide(
        queryClient,
        <Arbeidsuforhet />,
        arbeidsuforhetPath,
        [arbeidsuforhetPath]
      );

      await clickButton(oppfyltButtonText);

      expect(screen.queryByText("Siste vurdering")).to.not.exist;
      expect(
        screen.queryByRole("button", { name: sendForhandsvarselButtonText })
      ).to.not.exist;
      expect(screen.queryByRole("button", { name: oppfyltButtonText })).to.not
        .exist;
    });
  });
});
