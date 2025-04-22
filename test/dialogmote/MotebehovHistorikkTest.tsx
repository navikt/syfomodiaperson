import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, it } from "vitest";
import { queryClientWithMockData } from "../testQueryClient";
import React from "react";
import MotebehovHistorikk from "@/sider/dialogmoter/components/motehistorikk/MotebehovHistorikk";
import { motebehovQueryKeys } from "@/data/motebehov/motebehovQueryHooks";
import { ARBEIDSTAKER_DEFAULT } from "@/mocks/common/mockConstants";
import {
  svartNeiMotebehovArbeidsgiverUbehandletMock,
  meldtMotebehovArbeidstakerBehandletMock,
  motebehovMock,
} from "@/mocks/syfomotebehov/motebehovMock";

let queryClient: QueryClient;

const renderMotebehovHistorikk = () => {
  render(
    <QueryClientProvider client={queryClient}>
      <MotebehovHistorikk />
    </QueryClientProvider>
  );
};

describe("MotebehovHistorikk", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });
  it("viser alle historiske møtebehov", () => {
    queryClient.setQueryData(
      motebehovQueryKeys.motebehov(ARBEIDSTAKER_DEFAULT.personIdent),
      () => motebehovMock
    );

    renderMotebehovHistorikk();

    const accordions = screen.getAllByRole("button");
    expect(accordions).to.have.length(3);
    expect(screen.getByText("Jeg svarer på møtebehov ved 17 uker")).to.exist;
    expect(screen.getByText("Møter er bra!")).to.exist;
    expect(screen.getByText("Jeg liker ikke møte!!")).to.exist;
    expect(
      screen.getAllByText("Møtebehov fra den sykmeldte", { exact: false })
    ).to.have.length(2);
    expect(screen.getByText("Møtebehov fra nærmeste leder", { exact: false }))
      .to.exist;
  });
  it("viser ingen historiske møtebehov", () => {
    queryClient.setQueryData(
      motebehovQueryKeys.motebehov(ARBEIDSTAKER_DEFAULT.personIdent),
      () => []
    );

    renderMotebehovHistorikk();

    expect(screen.getByText("Ingen tidligere møtebehov")).to.exist;
  });
  it("viser kun møtebehov fra arbeidsgiver", () => {
    queryClient.setQueryData(
      motebehovQueryKeys.motebehov(ARBEIDSTAKER_DEFAULT.personIdent),
      () => [svartNeiMotebehovArbeidsgiverUbehandletMock()]
    );

    renderMotebehovHistorikk();

    expect(screen.getByText("Møtebehov fra nærmeste leder", { exact: false }))
      .to.exist;
    expect(screen.queryByText("Møtebehov fra den sykmeldte", { exact: false }))
      .to.not.exist;
  });
  it("viser kun møtebehov fra arbeidstaker", () => {
    queryClient.setQueryData(
      motebehovQueryKeys.motebehov(ARBEIDSTAKER_DEFAULT.personIdent),
      () => [meldtMotebehovArbeidstakerBehandletMock()]
    );

    renderMotebehovHistorikk();

    expect(screen.getByText("Møtebehov fra den sykmeldte", { exact: false })).to
      .exist;
    expect(screen.queryByText("Møtebehov fra nærmeste leder", { exact: false }))
      .to.not.exist;
  });
  it("viser at møtebehovet er behandlet", () => {
    queryClient.setQueryData(
      motebehovQueryKeys.motebehov(ARBEIDSTAKER_DEFAULT.personIdent),
      () => [meldtMotebehovArbeidstakerBehandletMock()]
    );

    renderMotebehovHistorikk();

    expect(
      screen.getByText("Møtebehovet ble vurdert av Z990000 den", {
        exact: false,
      })
    ).to.exist;
  });
});
