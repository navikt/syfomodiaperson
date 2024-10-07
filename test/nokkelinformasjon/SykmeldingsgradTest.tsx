import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { queryClientWithMockData } from "../testQueryClient";
import React from "react";
import { render, screen } from "@testing-library/react";
import { Sykmeldingsgrad } from "@/sider/nokkelinformasjon/sykmeldingsgrad/Sykmeldingsgrad";
import { expect, describe, it, beforeEach } from "vitest";
import { sykmeldingerMock } from "@/mocks/syfosmregister/sykmeldingerMock";
import { addDays, tilLesbarPeriodeMedArUtenManednavn } from "@/utils/datoUtils";
import { PeriodetypeDTO } from "@/data/sykmelding/types/PeriodetypeDTO";
import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import {
  createOppfolgingstilfelleFromSykmelding,
  setSykmeldingDataFromOppfolgingstilfelle,
} from "../utils/oppfolgingstilfelleUtils";

let queryClient: QueryClient;

const renderSykmeldingsgrad = (
  oppfolgingstilfelle: OppfolgingstilfelleDTO | undefined
) =>
  render(
    <QueryClientProvider client={queryClient}>
      <Sykmeldingsgrad
        selectedOppfolgingstilfelle={oppfolgingstilfelle}
        setSelectedOppfolgingstilfelle={(oppfolgingstilfelle) =>
          oppfolgingstilfelle
        }
      />
    </QueryClientProvider>
  );

describe("Sykmeldingsgrad", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  const sykmeldingNow = [
    {
      ...sykmeldingerMock[0],
      sykmeldingsperioder: [
        {
          fom: addDays(new Date(), -10).toString(),
          tom: addDays(new Date(), 10).toString(),
          type: PeriodetypeDTO.AKTIVITET_IKKE_MULIG,
          reisetilskudd: false,
        },
      ],
    },
  ];

  const sykmeldingEarlier = [
    {
      ...sykmeldingerMock[0],
      sykmeldingsperioder: [
        {
          fom: addDays(new Date(), -30).toString(),
          tom: addDays(new Date(), -20).toString(),
          type: PeriodetypeDTO.AKTIVITET_IKKE_MULIG,
          reisetilskudd: false,
        },
      ],
    },
  ];

  it("should render Sykmeldingsgrad when active tilfelle", () => {
    const oppfolgingstilfeller =
      createOppfolgingstilfelleFromSykmelding(sykmeldingNow);
    setSykmeldingDataFromOppfolgingstilfelle(
      sykmeldingNow,
      oppfolgingstilfeller,
      queryClient
    );
    renderSykmeldingsgrad(oppfolgingstilfeller[0]);

    expect(screen.getByText("Sykmeldingsgrad")).to.exist;
    expect(screen.getByText("Siste sykefravær")).to.exist;
    expect(screen.getByText("Valgt tilfelle sin varighet:", { exact: false }))
      .to.exist;
    expect(
      screen.getByText(
        `${tilLesbarPeriodeMedArUtenManednavn(
          oppfolgingstilfeller[0].start,
          oppfolgingstilfeller[0].end
        )}`
      )
    ).to.exist;
    expect(screen.getByText(`(${oppfolgingstilfeller[0].varighetUker} uker)`))
      .to.exist;
    expect(
      screen.getByText(sykmeldingNow[0].medisinskVurdering.hovedDiagnose.kode)
    ).to.exist;
  });

  it("should render Sykmeldingsgrad when no sykmelding", () => {
    const oppfolgingstilfeller = createOppfolgingstilfelleFromSykmelding();
    setSykmeldingDataFromOppfolgingstilfelle(
      [],
      oppfolgingstilfeller,
      queryClient
    );
    renderSykmeldingsgrad(undefined);

    expect(screen.getByText("Sykmeldingsgrad")).to.exist;
    expect(screen.getByText("Siste sykefravær")).to.exist;
    expect(screen.queryByText("Valgt tilfelle sin varighet:", { exact: false }))
      .to.not.exist;
  });

  it("should render Sykmeldingsgrad when old tilfelle and sykmelding", () => {
    const oppfolgingstilfeller =
      createOppfolgingstilfelleFromSykmelding(sykmeldingEarlier);
    setSykmeldingDataFromOppfolgingstilfelle(
      sykmeldingEarlier,
      oppfolgingstilfeller,
      queryClient
    );
    renderSykmeldingsgrad(oppfolgingstilfeller[0]);

    expect(screen.getByText("Sykmeldingsgrad")).to.exist;
    expect(screen.getByText("Siste sykefravær")).to.exist;
    expect(screen.getByText("Valgt tilfelle sin varighet:", { exact: false }))
      .to.exist;
    expect(
      screen.getByText(
        `${tilLesbarPeriodeMedArUtenManednavn(
          oppfolgingstilfeller[0].start,
          oppfolgingstilfeller[0].end
        )}`
      )
    ).to.exist;
    expect(screen.getByText(`(${oppfolgingstilfeller[0].varighetUker} uker)`))
      .to.exist;
    expect(
      screen.getByText(sykmeldingNow[0].medisinskVurdering.hovedDiagnose.kode)
    ).to.exist;
  });
});
