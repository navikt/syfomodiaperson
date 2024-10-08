import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { Nokkelinformasjon } from "@/sider/nokkelinformasjon/Nokkelinformasjon";
import { addDays } from "@/utils/datoUtils";
import {
  ARBEIDSTAKER_DEFAULT,
  LEDERE_DEFAULT,
} from "@/mocks/common/mockConstants";
import { sykmeldingerMock } from "@/mocks/syfosmregister/sykmeldingerMock";
import { PeriodetypeDTO } from "@/data/sykmelding/types/PeriodetypeDTO";
import { beforeEach, describe, expect, it } from "vitest";
import { queryClientWithMockData } from "../testQueryClient";
import { navEnhet } from "../dialogmote/testData";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { MemoryRouter } from "react-router-dom";
import { oppfolgingsplanQueryKeys } from "@/data/oppfolgingsplan/oppfolgingsplanQueryHooks";
import { ledereQueryKeys } from "@/data/leder/ledereQueryHooks";
import {
  createOppfolgingstilfelleFromSykmelding,
  setSykmeldingDataFromOppfolgingstilfelle,
} from "../utils/oppfolgingstilfelleUtils";

let queryClient: QueryClient;

const renderNokkelinformasjon = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <ValgtEnhetContext.Provider
          value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
        >
          <Nokkelinformasjon />
        </ValgtEnhetContext.Provider>
      </MemoryRouter>
    </QueryClientProvider>
  );

const sykmeldingOppfolgingstilfelle1 = {
  ...sykmeldingerMock[0],
  arbeidsgiver: {
    navn: "Tilfelle 1 AS",
    yrkesbetegnelse: "Yrkestittel tilfelle 1",
    stillingsprosent: 100,
  },
  sykmeldingsperioder: [
    {
      fom: addDays(new Date(), -10).toString(),
      tom: addDays(new Date(), 10).toString(),
      type: PeriodetypeDTO.AKTIVITET_IKKE_MULIG,
      reisetilskudd: false,
    },
  ],
};

const sykmeldingOppfolgingstilfelle2 = {
  ...sykmeldingerMock[0],
  arbeidsgiver: {
    navn: "Tilfelle 2 AS",
    yrkesbetegnelse: "Yrkestittel tilfelle 2",
    stillingsprosent: 100,
  },
  sykmeldingsperioder: [
    {
      fom: addDays(new Date(), -100).toString(),
      tom: addDays(new Date(), -70).toString(),
      type: PeriodetypeDTO.AKTIVITET_IKKE_MULIG,
      reisetilskudd: false,
    },
  ],
};

describe("Nokkelinformasjon", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
    queryClient.setQueryData(
      oppfolgingsplanQueryKeys.oppfolgingsplaner(
        ARBEIDSTAKER_DEFAULT.personIdent
      ),
      () => []
    );
    queryClient.setQueryData(
      ledereQueryKeys.ledere(ARBEIDSTAKER_DEFAULT.personIdent),
      () => [LEDERE_DEFAULT[0]]
    );
  });

  it("Endrer hvilken sykmelding som vises når man klikker på ulike oppfolgingstilfeller", async () => {
    const oppfolgingstilfelle1 = createOppfolgingstilfelleFromSykmelding([
      sykmeldingOppfolgingstilfelle1,
    ])[0];
    const oppfolgingstilfelle2 = createOppfolgingstilfelleFromSykmelding([
      sykmeldingOppfolgingstilfelle2,
    ])[0];

    setSykmeldingDataFromOppfolgingstilfelle(
      [sykmeldingOppfolgingstilfelle1, sykmeldingOppfolgingstilfelle2],
      [oppfolgingstilfelle1, oppfolgingstilfelle2],
      queryClient
    );

    renderNokkelinformasjon();

    expect(await screen.findAllByText("Nøkkelinformasjon")).to.have.length(2);
    expect(screen.getByText("Yrkestittel tilfelle 1")).to.exist;
    expect(screen.queryByText("Yrkestittel tilfelle 2")).to.not.exist;

    const oppfolgingstilfelleOptions = screen.getAllByRole("radio");
    expect(oppfolgingstilfelleOptions).to.have.length(2);

    fireEvent.click(oppfolgingstilfelleOptions[1]);

    expect(screen.getByText("Yrkestittel tilfelle 2")).to.exist;
    expect(screen.queryByText("Yrkestittel tilfelle 1")).to.not.exist;
  });
});
