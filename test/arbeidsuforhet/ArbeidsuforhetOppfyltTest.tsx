import { QueryClient } from "@tanstack/react-query";
import React from "react";
import { queryClientWithMockData } from "../testQueryClient";
import { ARBEIDSTAKER_DEFAULT } from "@/mocks/common/mockConstants";
import { screen } from "@testing-library/react";
import { expect, describe, it, beforeEach } from "vitest";
import {
  VurderingResponseDTO,
  VurderingType,
} from "@/data/arbeidsuforhet/arbeidsuforhetTypes";
import { arbeidsuforhetQueryKeys } from "@/data/arbeidsuforhet/arbeidsuforhetQueryHooks";
import { addWeeks } from "@/utils/datoUtils";
import {
  createForhandsvarsel,
  createVurdering,
} from "./arbeidsuforhetTestData";
import { ArbeidsuforhetOppfylt } from "@/sider/arbeidsuforhet/oppfylt/ArbeidsuforhetOppfylt";
import { arbeidsuforhetOppfyltPath } from "@/routers/AppRouter";
import { renderArbeidsuforhetSide } from "./arbeidsuforhetTestUtils";

let queryClient: QueryClient;

const mockArbeidsuforhetVurderinger = (vurderinger: VurderingResponseDTO[]) => {
  queryClient.setQueryData(
    arbeidsuforhetQueryKeys.arbeidsuforhet(ARBEIDSTAKER_DEFAULT.personIdent),
    () => vurderinger
  );
};

const renderArbeidsuforhetOppfyltSide = () => {
  renderArbeidsuforhetSide(
    queryClient,
    <ArbeidsuforhetOppfylt />,
    arbeidsuforhetOppfyltPath,
    [arbeidsuforhetOppfyltPath]
  );
};

describe("OppfyltSide", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  it("show form if latest arbeidsuforhet status is forhandsvarsel and frist is utgatt", () => {
    const forhandsvarselAfterFrist = createForhandsvarsel({
      createdAt: new Date(),
      svarfrist: addWeeks(new Date(), -3),
    });
    const vurderinger = [forhandsvarselAfterFrist];
    mockArbeidsuforhetVurderinger(vurderinger);

    renderArbeidsuforhetOppfyltSide();

    expect(
      screen.getByRole("heading", {
        name: "Skriv innstilling om oppfylt vilkår",
      })
    ).to.exist;
  });

  it("show form if latest arbeidsuforhet status is forhandsvarsel and frist is not utgatt", () => {
    const forhandsvarselBeforeFrist = createForhandsvarsel({
      createdAt: new Date(),
      svarfrist: addWeeks(new Date(), 3),
    });
    const vurderinger = [forhandsvarselBeforeFrist];
    mockArbeidsuforhetVurderinger(vurderinger);

    renderArbeidsuforhetOppfyltSide();

    expect(
      screen.getByRole("heading", {
        name: "Skriv innstilling om oppfylt vilkår",
      })
    ).to.exist;
  });

  it("show form if latest arbeidsuforhet status is Oppfylt", () => {
    const oppfylt = createVurdering({
      type: VurderingType.OPPFYLT,
      begrunnelse: "begrunnelse",
      createdAt: new Date(),
    });
    const vurderinger = [oppfylt];
    mockArbeidsuforhetVurderinger(vurderinger);

    renderArbeidsuforhetOppfyltSide();

    expect(
      screen.getByRole("heading", {
        name: "Skriv innstilling om oppfylt vilkår",
      })
    ).to.exist;
  });

  it("show form if latest arbeidsuforhet status is Avslag", () => {
    const avslag = createVurdering({
      type: VurderingType.AVSLAG,
      begrunnelse: "begrunnelse",
      createdAt: new Date(),
    });
    const vurderinger = [avslag];
    mockArbeidsuforhetVurderinger(vurderinger);

    renderArbeidsuforhetOppfyltSide();

    expect(
      screen.getByRole("heading", {
        name: "Skriv innstilling om oppfylt vilkår",
      })
    ).to.exist;
  });
});
