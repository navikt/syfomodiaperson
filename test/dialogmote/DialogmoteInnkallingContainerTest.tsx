import { render, screen } from "@testing-library/react";
import React from "react";
import { queryClientWithMockData } from "../testQueryClient";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { oppfolgingstilfellePersonQueryKeys } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import {
  ARBEIDSTAKER_DEFAULT,
  VIRKSOMHET_PONTYPANDY,
} from "@/mocks/common/mockConstants";
import {
  OppfolgingstilfelleDTO,
  OppfolgingstilfellePersonDTO,
} from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import { expect, describe, it, beforeEach } from "vitest";
import { daysFromToday } from "../testUtils";
import { navEnhet } from "./testData";
import { MalformProvider } from "@/context/malform/MalformContext";
import { dagerMellomDatoer } from "@/utils/datoUtils";
import DialogmoteInnkallingContainer from "@/sider/dialogmoter/components/innkalling/DialogmoteInnkallingContainer";

let queryClient: QueryClient;

const fnr = ARBEIDSTAKER_DEFAULT.personIdent;

const mockOppfolgingstilfellePerson = (
  oppfolgingstilfeller: OppfolgingstilfelleDTO[]
) => {
  const oppfolgingstilfellePerson: OppfolgingstilfellePersonDTO = {
    personIdent: fnr,
    oppfolgingstilfelleList: oppfolgingstilfeller,
    hasGjentakendeSykefravar: false,
  };
  queryClient.setQueryData(
    oppfolgingstilfellePersonQueryKeys.oppfolgingstilfelleperson(fnr),
    () => oppfolgingstilfellePerson
  );
};

const createOppfolgingstilfelle = (end: Date): OppfolgingstilfelleDTO => {
  return {
    virksomhetsnummerList: [VIRKSOMHET_PONTYPANDY.virksomhetsnummer],
    arbeidstakerAtTilfelleEnd: true,
    end,
    start: daysFromToday(-10),
    antallSykedager: dagerMellomDatoer(daysFromToday(-10), end) + 1,
    varighetUker: 1,
  };
};

const renderDialogmoteInnkallingContainer = () =>
  render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <ValgtEnhetContext.Provider
          value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
        >
          <MalformProvider>
            <DialogmoteInnkallingContainer />
          </MalformProvider>
        </ValgtEnhetContext.Provider>
      </QueryClientProvider>
    </MemoryRouter>
  );

describe("DialogmoteInnkallingContainer", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  it("viser skjema når det er mindre enn 16 dager siden brukers siste oppfolgingstilfelle", () => {
    mockOppfolgingstilfellePerson([
      createOppfolgingstilfelle(daysFromToday(-15)),
    ]);
    renderDialogmoteInnkallingContainer();

    expect(screen.queryByRole("img", { name: "feil-ikon" })).to.not.exist;
  });
  it("viser skjema når det er 16 dager siden brukers siste oppfolgingstilfelle", () => {
    mockOppfolgingstilfellePerson([
      createOppfolgingstilfelle(daysFromToday(-16)),
    ]);
    renderDialogmoteInnkallingContainer();

    expect(screen.queryByRole("img", { name: "feil-ikon" })).to.not.exist;
  });
  it("viser skjema med alert når det er mer enn 16 dager siden brukers siste oppfolgingstilfelle", () => {
    mockOppfolgingstilfellePerson([
      createOppfolgingstilfelle(daysFromToday(-17)),
    ]);
    renderDialogmoteInnkallingContainer();

    expect(
      screen.getByText(
        "Bruker har ikke digital sykmelding. Arbeidsgiver vil derfor ikke få varsel på nav.no, men en kopi av innkallingen i Altinn. Vurder å varsle arbeidsgiver om møtet på annen måte i tillegg."
      )
    ).to.exist;

    expect(screen.queryByRole("img", { name: "feil-ikon" })).to.not.exist;
  });

  it("don't show a no virksomhet alert in schema when innbygger has no oppfolgingstilfelle", () => {
    mockOppfolgingstilfellePerson([]);
    renderDialogmoteInnkallingContainer();

    expect(
      screen.queryByText(/Denne arbeidstakeren har ingen aktiv sykemelding,/)
    ).to.not.exist;
  });
});
