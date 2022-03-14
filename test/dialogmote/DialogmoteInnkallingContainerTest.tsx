import { render, screen } from "@testing-library/react";
import DialogmoteInnkallingContainer from "@/components/dialogmote/innkalling/DialogmoteInnkallingContainer";
import React from "react";
import { queryClientWithMockData } from "../testQueryClient";
import { createStore } from "redux";
import { rootReducer } from "@/data/rootState";
import configureStore from "redux-mock-store";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "react-query";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { oppfolgingstilfellePersonQueryKeys } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { ARBEIDSTAKER_DEFAULT } from "../../mock/common/mockConstants";
import {
  OppfolgingstilfelleDTO,
  OppfolgingstilfellePersonDTO,
} from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import { expect } from "chai";
import { daysFromToday } from "../testUtils";
import { navEnhet } from "./testData";

const realState = createStore(rootReducer).getState();
const store = configureStore([]);
let queryClient: QueryClient;

const fnr = ARBEIDSTAKER_DEFAULT.personIdent;

const mockOppfolgingstilfellePerson = (
  oppfolgingstilfeller: OppfolgingstilfelleDTO[]
) => {
  const oppfolgingstilfellePerson: OppfolgingstilfellePersonDTO = {
    personIdent: fnr,
    oppfolgingstilfelleList: oppfolgingstilfeller,
  };
  queryClient.setQueryData(
    oppfolgingstilfellePersonQueryKeys.oppfolgingstilfelleperson(fnr),
    () => oppfolgingstilfellePerson
  );
};

const createOppfolgingstilfelle = (end: Date): OppfolgingstilfelleDTO => {
  return {
    virksomhetsnummerList: [],
    arbeidstakerAtTilfelleEnd: true,
    end,
    start: daysFromToday(-10),
  };
};

const renderDialogmoteInnkallingContainer = () =>
  render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <ValgtEnhetContext.Provider
          value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
        >
          <Provider store={store({ ...realState })}>
            <DialogmoteInnkallingContainer />
          </Provider>
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

    expect(screen.getByRole("img", { name: "advarsel-ikon" })).to.exist;
    expect(screen.getByText(/I denne nye løsningen sender du innkalling/)).to
      .exist;

    expect(screen.queryByRole("img", { name: "feil-ikon" })).to.not.exist;
  });
  it("viser skjema når det er 16 dager siden brukers siste oppfolgingstilfelle", () => {
    mockOppfolgingstilfellePerson([
      createOppfolgingstilfelle(daysFromToday(-16)),
    ]);
    renderDialogmoteInnkallingContainer();

    expect(screen.getByRole("img", { name: "advarsel-ikon" })).to.exist;
    expect(screen.getByText(/I denne nye løsningen sender du innkalling/)).to
      .exist;

    expect(screen.queryByRole("img", { name: "feil-ikon" })).to.not.exist;
  });
  it("viser feilmelding når det er mer enn 16 dager siden brukers siste oppfolgingstilfelle", () => {
    mockOppfolgingstilfellePerson([
      createOppfolgingstilfelle(daysFromToday(-17)),
    ]);
    renderDialogmoteInnkallingContainer();

    expect(screen.getByRole("img", { name: "feil-ikon" })).to.exist;
    expect(
      screen.getByText(
        /Vi kan ikke sende innkalling til dialogmøte til denne arbeidstakeren/
      )
    ).to.exist;

    expect(screen.queryByText(/I denne nye løsningen sender du innkalling/)).to
      .not.exist;
  });
  it("viser feilmelding når bruker mangler oppfolgingstilfelle", () => {
    mockOppfolgingstilfellePerson([]);
    renderDialogmoteInnkallingContainer();

    expect(screen.getByRole("img", { name: "feil-ikon" })).to.exist;
    expect(
      screen.getByText(
        /Vi kan ikke sende innkalling til dialogmøte til denne arbeidstakeren/
      )
    ).to.exist;

    expect(screen.queryByText(/I denne nye løsningen sender du innkalling/)).to
      .not.exist;
  });
});
