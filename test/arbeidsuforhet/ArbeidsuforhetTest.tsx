import { QueryClient } from "@tanstack/react-query";
import React from "react";
import { queryClientWithMockData } from "../testQueryClient";
import {
  ARBEIDSTAKER_DEFAULT,
  BEHANDLENDE_ENHET_DEFAULT,
  VEILEDER_IDENT_DEFAULT,
} from "@/mocks/common/mockConstants";
import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import {
  VurderingArsak,
  VurderingResponseDTO,
  VurderingType,
} from "@/sider/arbeidsuforhet/data/arbeidsuforhetTypes";
import { arbeidsuforhetQueryKeys } from "@/sider/arbeidsuforhet/hooks/arbeidsuforhetQueryHooks";
import { addWeeks } from "@/utils/datoUtils";
import {
  createForhandsvarsel,
  createVurdering,
} from "./arbeidsuforhetTestData";
import Arbeidsuforhet from "@/sider/arbeidsuforhet/Arbeidsuforhet";
import { arbeidsuforhetPath } from "@/routers/AppRouter";
import { clickButton } from "../testUtils";
import { renderArbeidsuforhetSide } from "./arbeidsuforhetTestUtils";
import { unleashQueryKeys } from "@/data/unleash/unleashQueryHooks";
import { mockUnleashTogglesOffResponse } from "@/mocks/unleashMocks";

let queryClient: QueryClient;

const stubArbeidsuforhetVurderinger = (vurderinger: VurderingResponseDTO[]) => {
  queryClient.setQueryData(
    arbeidsuforhetQueryKeys.arbeidsuforhet(ARBEIDSTAKER_DEFAULT.personIdent),
    () => vurderinger
  );
};

describe("ArbeidsuforhetSide", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
    queryClient.setQueryData(
      unleashQueryKeys.toggles(
        BEHANDLENDE_ENHET_DEFAULT.enhetId,
        VEILEDER_IDENT_DEFAULT
      ),
      () => mockUnleashTogglesOffResponse
    );
  });
  const nyVurderingButtonText = "Start ny vurdering";

  it("shows registrer ny vurdering page", async () => {
    stubArbeidsuforhetVurderinger([]);

    renderArbeidsuforhetSide(
      queryClient,
      <Arbeidsuforhet />,
      arbeidsuforhetPath,
      [arbeidsuforhetPath]
    );
    await clickButton(nyVurderingButtonText);

    expect(screen.getByText("Registrer ny vurdering")).to.exist;
    expect(screen.getByRole("button", { name: "Forhåndsvarsel" })).to.exist;
  });

  describe("Show ny vurdering button", () => {
    it("if there are no vurderinger", () => {
      const vurderinger = [];
      stubArbeidsuforhetVurderinger(vurderinger);

      renderArbeidsuforhetSide(
        queryClient,
        <Arbeidsuforhet />,
        arbeidsuforhetPath,
        [arbeidsuforhetPath]
      );

      expect(screen.getByText("Siste vurdering")).to.exist;
      expect(screen.getByRole("button", { name: nyVurderingButtonText })).to
        .exist;
    });

    it("if latest arbeidsuforhet status is oppfylt", () => {
      const oppfyltVurdering = createVurdering({
        type: VurderingType.OPPFYLT,
        begrunnelse: "begrunnelse",
        createdAt: new Date(),
      });
      const vurderinger = [oppfyltVurdering];
      stubArbeidsuforhetVurderinger(vurderinger);

      renderArbeidsuforhetSide(
        queryClient,
        <Arbeidsuforhet />,
        arbeidsuforhetPath,
        [arbeidsuforhetPath]
      );

      expect(screen.getByText("Siste vurdering")).to.exist;
      expect(screen.getByText(/og oppfylt/)).to.exist;
      expect(screen.getByRole("button", { name: nyVurderingButtonText })).to
        .exist;
    });

    it("if status is avslag", () => {
      const avslag = createVurdering({
        type: VurderingType.AVSLAG,
        begrunnelse: "",
        createdAt: new Date(),
      });
      const vurderinger = [avslag];
      stubArbeidsuforhetVurderinger(vurderinger);

      renderArbeidsuforhetSide(
        queryClient,
        <Arbeidsuforhet />,
        arbeidsuforhetPath,
        [arbeidsuforhetPath]
      );

      expect(screen.getByText("Siste vurdering")).to.exist;
      expect(screen.getByText(/og innstilling om avslag/)).to.exist;
      expect(screen.getByText("Start ny vurdering")).to.exist;
    });

    it("if status is ikke aktuell", () => {
      const ikkeAktuell = createVurdering({
        type: VurderingType.IKKE_AKTUELL,
        begrunnelse: "",
        arsak: VurderingArsak.FRISKMELDT,
        createdAt: new Date(),
      });
      const vurderinger = [ikkeAktuell];
      stubArbeidsuforhetVurderinger(vurderinger);

      renderArbeidsuforhetSide(
        queryClient,
        <Arbeidsuforhet />,
        arbeidsuforhetPath,
        [arbeidsuforhetPath]
      );

      expect(screen.getByText("Siste vurdering")).to.exist;
      expect(screen.getByText(/ikke aktuell/)).to.exist;
      expect(screen.getByText("Start ny vurdering")).to.exist;
    });
  });

  describe("Show sent forhandsvarsel page", () => {
    it("if status is forhandsvarsel and frist is not utgatt", () => {
      const forhandsvarselBeforeFrist = createForhandsvarsel({
        createdAt: new Date(),
        svarfrist: addWeeks(new Date(), 3),
      });
      const vurderinger = [forhandsvarselBeforeFrist];
      stubArbeidsuforhetVurderinger(vurderinger);

      renderArbeidsuforhetSide(
        queryClient,
        <Arbeidsuforhet />,
        arbeidsuforhetPath,
        [arbeidsuforhetPath]
      );

      expect(screen.queryByRole("button", { name: nyVurderingButtonText })).to
        .not.exist;
      expect(screen.queryByText("Send forhåndsvarsel")).to.not.exist;
      expect(screen.getByText("Venter på svar fra bruker")).to.exist;
      expect(screen.queryByText("Fristen er gått ut")).to.not.exist;
    });

    it("show sent forhandsvarsel page if status is forhandsvarsel and frist is utgatt", () => {
      const forhandsvarselBeforeFrist = createForhandsvarsel({
        createdAt: new Date(),
        svarfrist: addWeeks(new Date(), -3),
      });
      const vurderinger = [forhandsvarselBeforeFrist];
      stubArbeidsuforhetVurderinger(vurderinger);

      renderArbeidsuforhetSide(
        queryClient,
        <Arbeidsuforhet />,
        arbeidsuforhetPath,
        [arbeidsuforhetPath]
      );

      expect(screen.queryByRole("button", { name: nyVurderingButtonText })).to
        .not.exist;
      expect(screen.queryByText("Send forhåndsvarsel")).to.not.exist;
      expect(screen.queryByText("Venter på svar fra bruker")).to.not.exist;
      expect(screen.getByText("Fristen er gått ut")).to.exist;
    });
  });
});
