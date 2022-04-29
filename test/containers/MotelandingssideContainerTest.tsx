import React from "react";
import { expect } from "chai";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
import Motelandingsside from "../../src/components/mote/components/Motelandingsside";
import { createStore } from "redux";
import { rootReducer } from "@/data/rootState";
import { QueryClientProvider } from "react-query";
import { dialogmoterQueryKeys } from "@/data/dialogmote/dialogmoteQueryHooks";
import {
  ARBEIDSTAKER_DEFAULT,
  LEDERE_DEFAULT,
  VEILEDER_IDENT_DEFAULT,
} from "../../mock/common/mockConstants";
import { render, screen } from "@testing-library/react";
import { stubTilgangApi } from "../stubs/stubSyfotilgangskontroll";
import { apiMock } from "../stubs/stubApi";
import nock from "nock";
import { tilgangQueryKeys } from "@/data/tilgang/tilgangQueryHooks";
import { tilgangBrukerMock } from "../../mock/syfotilgangskontroll/tilgangtilbrukerMock";
import { oppfolgingsplanQueryKeys } from "@/data/oppfolgingsplan/oppfolgingsplanQueryHooks";
import { motebehovQueryKeys } from "@/data/motebehov/motebehovQueryHooks";
import { ledereQueryKeys } from "@/data/leder/ledereQueryHooks";
import { queryClientWithAktivBruker } from "../testQueryClient";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { MemoryRouter } from "react-router-dom";

const realState = createStore(rootReducer).getState();
const fnr = ARBEIDSTAKER_DEFAULT.personIdent;
let queryClient;
let apiMockScope;
let store;
let mockState;

const motebehovData = [
  {
    UUID: "33333333-c987-4b57-a401-a3915ec11411",
    id: "33333333-ee10-44b6-bddf-54d049ef25f2",
    opprettetDato: "2019-01-08T13:53:57.047+01:00",
    aktorId: "1",
    opprettetAv: "1",
    virksomhetsnummer: "000999000",
    tildeltEnhet: "0330",
    behandletTidspunkt: "2019-01-10T13:53:57.047+01:00",
    behandletVeilederIdent: VEILEDER_IDENT_DEFAULT,
  },
];

const renderMotelandingsside = (mockStore) =>
  render(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: "", setValgtEnhet: () => void 0 }}
      >
        <Provider store={mockStore}>
          <MemoryRouter>
            <Motelandingsside />
          </MemoryRouter>
        </Provider>
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>
  );

describe("MotelandingssideContainer", () => {
  describe("MotelandingssideSide", () => {
    beforeEach(() => {
      queryClient = queryClientWithAktivBruker();
      queryClient.setQueryData(dialogmoterQueryKeys.dialogmoter(fnr), () => []);
      queryClient.setQueryData(
        oppfolgingsplanQueryKeys.oppfolgingsplaner(fnr),
        () => []
      );
      queryClient.setQueryData(
        motebehovQueryKeys.motebehov(fnr),
        () => motebehovData
      );
      queryClient.setQueryData(
        ledereQueryKeys.ledere(fnr),
        () => LEDERE_DEFAULT
      );
      apiMockScope = apiMock();
      store = configureStore([]);
      mockState = {
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
      };
    });

    afterEach(() => {
      nock.cleanAll();
    });

    it("Skal vise AppSpinner når henter data", () => {
      stubTilgangApi(apiMockScope);
      renderMotelandingsside(store({ ...realState, ...mockState }));

      expect(screen.getByLabelText("Vent litt mens siden laster")).to.exist;
    });

    it("Skal vise AppSpinner når henter tilgang", async () => {
      stubTilgangApi(apiMockScope);
      renderMotelandingsside(store({ ...realState, ...mockState }));

      expect(await screen.findByLabelText("Vent litt mens siden laster")).to
        .exist;
    });

    it("Skal kjøre actions ved init", () => {
      const mockStore = store({ ...realState, ...mockState });
      renderMotelandingsside(mockStore);

      const expectedActions = [{ type: "HENT_MOTER_FORESPURT", fnr: fnr }];
      expect(mockStore.getActions()).to.deep.equal(expectedActions);
    });

    it("Skal vise feilmelding hvis ikke tilgang", async () => {
      stubTilgangApi(apiMockScope, {
        harTilgang: false,
      });
      renderMotelandingsside(store({ ...realState, ...mockState }));

      expect(
        await screen.findByRole("heading", {
          name: "Du har ikke tilgang til denne tjenesten",
        })
      ).to.exist;
    });

    it("Skal vise Se møtestatus når møte opprettet", () => {
      queryClient.setQueryData(
        tilgangQueryKeys.tilgang(fnr),
        () => tilgangBrukerMock
      );
      mockState.moter = {
        hentingForsokt: true,
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
      renderMotelandingsside(store({ ...realState, ...mockState }));

      expect(
        screen.getByRole("heading", {
          name: "Se møtestatus",
        })
      ).to.exist;
    });

    it("Skal vise Bekreftet møte når møte bekreftet", () => {
      queryClient.setQueryData(
        tilgangQueryKeys.tilgang(fnr),
        () => tilgangBrukerMock
      );
      mockState.moter = {
        ...mockState.moter,
        data: [
          {
            id: 1,
            status: "BEKREFTET",
            opprettetTidspunkt: "2019-11-08T00:00:00.000Z",
          },
        ],
      };
      renderMotelandingsside(store({ ...realState, ...mockState }));

      expect(
        screen.getByRole("heading", {
          name: "Bekreftet møte",
        })
      ).to.exist;
    });

    it("Skal vise Planlegg nytt dialogmøte når møte avbrutt", () => {
      queryClient.setQueryData(
        tilgangQueryKeys.tilgang(fnr),
        () => tilgangBrukerMock
      );
      mockState.moter = {
        ...mockState.moter,
        data: [
          {
            id: 1,
            status: "AVBRUTT",
          },
        ],
      };
      renderMotelandingsside(store({ ...realState, ...mockState }));

      expect(
        screen.getByRole("heading", {
          name: "Planlegg nytt dialogmøte",
        })
      ).to.exist;
    });

    it("Skal vise Planlegg nytt dialogmøte når det ikke finnes møter", () => {
      queryClient.setQueryData(
        tilgangQueryKeys.tilgang(fnr),
        () => tilgangBrukerMock
      );
      renderMotelandingsside(store({ ...realState, ...mockState }));

      expect(
        screen.getByRole("heading", {
          name: "Planlegg nytt dialogmøte",
        })
      ).to.exist;
    });
  });
});
