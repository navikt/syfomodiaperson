import React from "react";
import { expect } from "chai";
import { mount } from "enzyme";
import AppSpinner from "../../src/components/AppSpinner";
import Feilmelding from "../../src/components/Feilmelding";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
import Motelandingsside from "../../src/components/mote/components/Motelandingsside";
import { MemoryRouter } from "react-router-dom";
import { createStore } from "redux";
import { rootReducer } from "@/data/rootState";
import { QueryClient, QueryClientProvider } from "react-query";
import { dialogmoterQueryKeys } from "@/data/dialogmote/dialogmoteQueryHooks";
import { NarmesteLederRelasjonStatus } from "../../mock/data/ledereMock";

const realState = createStore(rootReducer).getState();
const fnr = "19026900010";
let queryClient;

describe("MotelandingssideContainer", () => {
  describe("MotelandingssideSide", () => {
    let component;
    let store;
    let mockState;

    beforeEach(() => {
      queryClient = new QueryClient();
      queryClient.setQueryData(dialogmoterQueryKeys.dialogmoter(fnr), () => []);
      store = configureStore([]);
      mockState = {
        unleash: {
          fetching: false,
        },
        tilgang: {
          data: {
            harTilgang: true,
          },
        },
        navbruker: {
          data: {
            kontaktinfo: {
              fnr: fnr,
            },
          },
        },
        moter: {
          hentingForsokt: true,
          data: [],
        },
        motebehov: {
          hentet: true,
          hentingForsokt: true,
          data: [
            {
              UUID: "33333333-c987-4b57-a401-a3915ec11411",
              id: "33333333-ee10-44b6-bddf-54d049ef25f2",
              opprettetDato: "2019-01-08T13:53:57.047+01:00",
              aktorId: "1",
              opprettetAv: "1",
              virksomhetsnummer: "000999000",
              tildeltEnhet: "0330",
              behandletTidspunkt: "2019-01-10T13:53:57.047+01:00",
              behandletVeilederIdent: "Z990000",
            },
          ],
        },
        oppfoelgingsdialoger: {
          hentet: true,
        },
        ledere: {
          hentet: true,
          hentingForsokt: true,
          currentLedere: [
            {
              uuid: "3",
              arbeidstakerPersonIdentNumber: "19026900010",
              virksomhetsnummer: "110110110",
              virksomhetsnavn: "PONTYPANDY FIRE SERVICE",
              narmesteLederPersonIdentNumber: "02690001009",
              narmesteLederTelefonnummer: "12345666",
              narmesteLederEpost: "test3@test.no",
              narmesteLederNavn: "Tatten Tattover",
              aktivFom: "2020-10-03",
              aktivTom: null,
              arbeidsgiverForskutterer: false,
              timestamp: "2020-02-06T12:00:00+01:00",
              status: NarmesteLederRelasjonStatus.INNMELDT_AKTIV,
            },
          ],
        },
      };
    });

    it("Skal vise AppSpinner når henter data", () => {
      mockState.motebehov = {
        henter: true,
        hentet: false,
        data: [],
      };
      component = mount(
        <QueryClientProvider client={queryClient}>
          <Provider store={store({ ...realState, ...mockState })}>
            <Motelandingsside fnr="19026900010" />
          </Provider>
        </QueryClientProvider>
      );

      expect(component.find(AppSpinner)).to.have.length(1);
    });

    it("Skal vise AppSpinner når henter tilgang", () => {
      mockState.tilgang = {
        henter: true,
      };
      component = mount(
        <QueryClientProvider client={queryClient}>
          <Provider store={store({ ...realState, ...mockState })}>
            <Motelandingsside fnr="19026900010" />
          </Provider>
        </QueryClientProvider>
      );

      expect(component.find(AppSpinner)).to.have.length(1);
    });

    it("Skal kjøre actions ved init", () => {
      mockState.tilgang = {
        data: {
          harTilgang: false,
        },
      };
      const mockStore = store({ ...realState, ...mockState });
      component = mount(
        <QueryClientProvider client={queryClient}>
          <Provider store={mockStore}>
            <Motelandingsside fnr="19026900010" />
          </Provider>
        </QueryClientProvider>
      );

      const expectedActions = [
        { type: "HENT_LEDERE_FORESPURT", fnr: fnr },
        { type: "HENT_MOTER_FORESPURT", fnr: fnr },
        { type: "HENT_MOTEBEHOV_FORESPURT", fnr: fnr },
        { type: "HENT_SYKMELDINGER_FORESPURT", fnr: fnr },
        { type: "HENT_OPPFOELGINGSDIALOGER_FORESPURT", fnr: fnr },
        {
          type: "HENT_OPPFOLGINGSTILFELLEPERIODER_FORESPURT",
          fnr: fnr,
        },
      ];
      expect(mockStore.getActions()).to.deep.equal(expectedActions);
    });

    it("Skal vise feilmelding hvis ikke tilgang", () => {
      mockState.tilgang = {
        hentingForsokt: true,
        data: {
          harTilgang: false,
        },
      };
      component = mount(
        <QueryClientProvider client={queryClient}>
          <Provider store={store({ ...realState, ...mockState })}>
            <Motelandingsside fnr="19026900010" />
          </Provider>
        </QueryClientProvider>
      );

      expect(component.find(Feilmelding)).to.have.length(1);
    });

    it("Skal vise feilmelding hvis hentingFeilet", () => {
      mockState.tilgang = {
        hentingForsokt: true,
        hentingFeilet: true,
        data: {
          harTilgang: true,
        },
      };
      component = mount(
        <QueryClientProvider client={queryClient}>
          <Provider store={store({ ...realState, ...mockState })}>
            <Motelandingsside fnr="19026900010" />
          </Provider>
        </QueryClientProvider>
      );

      expect(component.find(Feilmelding)).to.have.length(1);
    });

    it("Skal vise Se møtestatus når møte opprettet", () => {
      mockState.moter = {
        data: [
          {
            id: 1,
            status: "OPPRETTET",
            bekreftetAlternativ: {
              tid: "2019-11-08T00:00:00.000Z",
            },
            opprettetTidspunkt: "2019-11-08T00:00:00.000Z",
          },
        ],
      };
      component = mount(
        <QueryClientProvider client={queryClient}>
          <Provider store={store({ ...realState, ...mockState })}>
            <MemoryRouter>
              <Motelandingsside fnr="887766" />
            </MemoryRouter>
          </Provider>
        </QueryClientProvider>
      );

      expect(component.find("h2").contains("Se møtestatus"));
    });

    it("Skal vise Bekreftet møte når møte bekreftet", () => {
      mockState.moter = {
        data: [
          {
            id: 1,
            status: "BEKREFTET",
            opprettetTidspunkt: "2019-11-08T00:00:00.000Z",
          },
        ],
      };
      component = mount(
        <QueryClientProvider client={queryClient}>
          <Provider store={store({ ...realState, ...mockState })}>
            <MemoryRouter>
              <Motelandingsside fnr="887766" />
            </MemoryRouter>
          </Provider>
        </QueryClientProvider>
      );

      expect(component.find("h2").contains("Bekreftet møte"));
    });

    it("Skal vise Forespør møte når møte avbrutt", () => {
      mockState.moter = {
        data: [
          {
            id: 1,
            status: "AVBRUTT",
          },
        ],
      };
      component = mount(
        <QueryClientProvider client={queryClient}>
          <Provider store={store({ ...realState, ...mockState })}>
            <MemoryRouter>
              <Motelandingsside fnr="887766" />
            </MemoryRouter>
          </Provider>
        </QueryClientProvider>
      );

      expect(component.find("h2").contains("Forespør møte"));
    });

    it("Skal vise Forespør møte når det ikke finnes møter", () => {
      component = mount(
        <QueryClientProvider client={queryClient}>
          <Provider store={store({ ...realState, ...mockState })}>
            <MemoryRouter>
              <Motelandingsside fnr="887766" />
            </MemoryRouter>
          </Provider>
        </QueryClientProvider>
      );

      expect(component.find("h2").contains("Forespør møte"));
    });
  });
});
