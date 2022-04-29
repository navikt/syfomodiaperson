import React from "react";
import { expect } from "chai";
import SykepengesoknadContainer from "../../src/components/speiling/sykepengsoknader/container/SykepengesoknadContainer";
import mockSoknader from "../mockdata/mockSoknader";
import { createStore } from "redux";
import { rootReducer } from "@/data/rootState";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { MemoryRouter, Route } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { QueryClientProvider } from "react-query";
import { tilgangQueryKeys } from "@/data/tilgang/tilgangQueryHooks";
import { tilgangBrukerMock } from "../../mock/syfotilgangskontroll/tilgangtilbrukerMock";
import { ARBEIDSTAKER_DEFAULT } from "../../mock/common/mockConstants";
import { sykepengesoknaderQueryKeys } from "@/data/sykepengesoknad/sykepengesoknadQueryHooks";
import { sykmeldingerQueryKeys } from "@/data/sykmelding/sykmeldingQueryHooks";
import { queryClientWithAktivBruker } from "../testQueryClient";

const NAERINGSDRIVENDESOKNAD_ID = "faadf7c1-3aac-4758-8673-e9cee1316a3c";
const OPPHOLD_UTLAND_ID = "e16ff778-8475-47e1-b5dc-d2ce4ad6b9ee";

const realState = createStore(rootReducer).getState();
const store = configureStore([]);
const fnr = ARBEIDSTAKER_DEFAULT.personIdent;
let queryClient;

const mockState = {
  navbruker: {
    data: {
      navn: "Ola Nordmann",
      kontaktinfo: { skalHaVarsel: false },
    },
  },
};

describe("SykepengesoknadContainer", () => {
  beforeEach(() => {
    queryClient = queryClientWithAktivBruker();
    queryClient.setQueryData(
      tilgangQueryKeys.tilgang(fnr),
      () => tilgangBrukerMock
    );
    queryClient.setQueryData(sykmeldingerQueryKeys.sykmeldinger(fnr), () => []);
  });

  describe("Visning av sykepengesøknad for arbeidstakere", () => {
    it("Skal vise SendtSoknadArbeidstakerNy", () => {
      queryClient.setQueryData(
        sykepengesoknaderQueryKeys.sykepengesoknader(fnr),
        () => mockSoknader
      );
      render(
        <MemoryRouter
          initialEntries={[
            `/sykefravaer/sykepengesoknader/${OPPHOLD_UTLAND_ID}`,
          ]}
        >
          <Route path="/sykefravaer/sykepengesoknader/:sykepengesoknadId">
            <QueryClientProvider client={queryClient}>
              <Provider
                store={store({
                  ...realState,
                  ...mockState,
                })}
              >
                <SykepengesoknadContainer />
              </Provider>
            </QueryClientProvider>
          </Route>
        </MemoryRouter>
      );

      expect(
        screen.getByRole("heading", {
          name: "Søknad om sykepenger under opphold utenfor Norge",
        })
      ).to.exist;
    });
  });

  describe("Håndtering av feil", () => {
    it("Skal vise feilmelding hvis søknaden er en selvstendig-søknad og henting av selvstendig-søknader feiler", () => {
      queryClient.setQueryData(
        sykepengesoknaderQueryKeys.sykepengesoknader(fnr),
        () => []
      );
      render(
        <MemoryRouter
          initialEntries={[
            `/sykefravaer/sykepengesoknader/${NAERINGSDRIVENDESOKNAD_ID}`,
          ]}
        >
          <Route path="/sykefravaer/sykepengesoknader/:sykepengesoknadId">
            <QueryClientProvider client={queryClient}>
              <Provider
                store={store({
                  ...realState,
                  ...mockState,
                })}
              >
                <SykepengesoknadContainer />
              </Provider>
            </QueryClientProvider>
          </Route>
        </MemoryRouter>
      );

      expect(
        screen.getByRole("heading", {
          name: "Beklager, det oppstod en feil",
        })
      ).to.exist;
    });
  });
});
