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

const NAERINGSDRIVENDESOKNAD_ID = "faadf7c1-3aac-4758-8673-e9cee1316a3c";
const OPPHOLD_UTLAND_ID = "e16ff778-8475-47e1-b5dc-d2ce4ad6b9ee";

const realState = createStore(rootReducer).getState();
const store = configureStore([]);
const mockState = {
  tilgang: {
    hentingForsokt: true,
    hentingFeilet: false,
    henter: false,
    hentet: true,
    data: {
      harTilgang: true,
    },
  },
  sykmeldinger: {
    hentet: true,
    hentingFeilet: false,
    data: [],
  },
  navbruker: {
    data: {
      navn: "Ola Nordmann",
      kontaktinfo: { skalHaVarsel: false },
    },
  },
  valgtbruker: {
    personident: "887766",
  },
};

describe("SykepengesoknadContainer", () => {
  describe("Visning av sykepengesøknad for arbeidstakere", () => {
    it("Skal vise SendtSoknadArbeidstakerNy", () => {
      const soknaderState = {
        hentet: true,
        hentingFeilet: false,
        data: mockSoknader,
      };
      render(
        <MemoryRouter
          initialEntries={[
            `/sykefravaer/sykepengesoknader/${OPPHOLD_UTLAND_ID}`,
          ]}
        >
          <Route path="/sykefravaer/sykepengesoknader/:sykepengesoknadId">
            <Provider
              store={store({
                ...realState,
                ...mockState,
                soknader: soknaderState,
              })}
            >
              <SykepengesoknadContainer />
            </Provider>
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
      const soknaderState = {
        data: [],
        hentingFeilet: true,
      };
      render(
        <MemoryRouter
          initialEntries={[
            `/sykefravaer/sykepengesoknader/${NAERINGSDRIVENDESOKNAD_ID}`,
          ]}
        >
          <Route path="/sykefravaer/sykepengesoknader/:sykepengesoknadId">
            <Provider
              store={store({
                ...realState,
                ...mockState,
                soknader: soknaderState,
              })}
            >
              <SykepengesoknadContainer />
            </Provider>
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
