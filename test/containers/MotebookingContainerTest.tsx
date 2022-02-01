import React from "react";
import { expect } from "chai";
import { MotebookingContainer } from "@/components/mote/container/MotebookingContainer";
import { createStore } from "redux";
import { rootReducer } from "@/data/rootState";
import { QueryClient, QueryClientProvider } from "react-query";
import configureStore from "redux-mock-store";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { tilgangQueryKeys } from "@/data/tilgang/tilgangQueryHooks";
import { tilgangBrukerMock } from "../../mock/data/tilgangtilbrukerMock";
import {
  ARBEIDSTAKER_DEFAULT,
  VIRKSOMHET_PONTYPANDY,
} from "../../mock/common/mockConstants";
import { MemoryRouter } from "react-router-dom";
import { NarmesteLederRelasjonStatus } from "../../mock/data/ledereMock";

const harIkkeMoterTilgang = {
  harTilgang: false,
  begrunnelse: "KODE7",
};
const realState = createStore(rootReducer).getState();
const fnr = ARBEIDSTAKER_DEFAULT.personIdent;
let queryClient;

describe("MotebookingContainer", () => {
  let store;
  let mockState;
  beforeEach(() => {
    queryClient = new QueryClient();
    queryClient.setQueryData(
      tilgangQueryKeys.tilgang(fnr),
      () => tilgangBrukerMock
    );
    store = configureStore([]);
    mockState = {
      enhet: { valgtEnhet: "2212" },
      ledere: {
        hentet: true,
        hentingForsokt: true,
        currentLedere: [
          {
            uuid: "3",
            arbeidstakerPersonIdentNumber: ARBEIDSTAKER_DEFAULT.personIdent,
            virksomhetsnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
            virksomhetsnavn: VIRKSOMHET_PONTYPANDY.virksomhetsnavn,
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
      valgtbruker: { personident: fnr },
    };
  });

  describe("MotebookingSide", () => {
    it("Skal vise AppSpinner", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <Provider store={store({ ...realState, ...mockState })}>
            <MemoryRouter>
              <MotebookingContainer />
            </MemoryRouter>
          </Provider>
        </QueryClientProvider>
      );
      expect(await screen.findByLabelText("Vent litt mens siden laster")).to
        .exist;
    });
    it("Skal hente møter ved init", () => {
      const mockStore = store({ ...realState, ...mockState });
      render(
        <QueryClientProvider client={queryClient}>
          <Provider store={mockStore}>
            <MemoryRouter>
              <MotebookingContainer />
            </MemoryRouter>
          </Provider>
        </QueryClientProvider>
      );

      const actions = mockStore.getActions();
      expect(
        actions.some(
          (action) =>
            action.type === "HENT_MOTER_FORESPURT" && action.fnr === fnr
        )
      ).to.be.true;
    });

    it("Skal vise feilmelding hvis henting feilet", () => {
      mockState.moter = {
        hentingFeilet: true,
        hentingForsokt: true,
        data: [],
      };
      render(
        <QueryClientProvider client={queryClient}>
          <Provider store={store({ ...realState, ...mockState })}>
            <MemoryRouter>
              <MotebookingContainer />
            </MemoryRouter>
          </Provider>
        </QueryClientProvider>
      );

      expect(
        screen.getByRole("heading", {
          name: "Beklager, det oppstod en feil",
        })
      ).to.exist;
    });

    it("Skal vise feilmelding dersom ikke tilgang til moter", () => {
      mockState.moter = {
        tilgang: harIkkeMoterTilgang,
        hentingForsokt: true,
        data: [],
      };
      render(
        <QueryClientProvider client={queryClient}>
          <Provider store={store({ ...realState, ...mockState })}>
            <MemoryRouter>
              <MotebookingContainer />
            </MemoryRouter>
          </Provider>
        </QueryClientProvider>
      );

      expect(
        screen.getByRole("heading", {
          name: "Du har ikke tilgang til denne tjenesten",
        })
      ).to.exist;
      expect(screen.getByText("Brukeren er registrert med skjermingskode 7."))
        .to.exist;
    });

    it("Skal vise MotestatusContainer hvis det finnes aktivt møte", () => {
      mockState.moter = {
        hentingForsokt: true,
        data: [
          {
            moteUuid: "8877",
            status: "OPPRETTET",
            deltakere: [],
            alternativer: [],
          },
        ],
      };
      render(
        <QueryClientProvider client={queryClient}>
          <Provider store={store({ ...realState, ...mockState })}>
            <MemoryRouter>
              <MotebookingContainer />
            </MemoryRouter>
          </Provider>
        </QueryClientProvider>
      );

      expect(
        screen.getByRole("heading", {
          name: "Forrige møte",
        })
      ).to.exist;
    });

    it("Skal vise MotebookingSkjemaContainer hvis det ikke finnes aktivt møte", () => {
      mockState.moter = {
        hentingForsokt: true,
        data: [
          {
            moteUuid: "8877",
            status: "AVBRUTT",
            deltakere: [],
            alternativer: [],
          },
        ],
      };
      render(
        <QueryClientProvider client={queryClient}>
          <Provider store={store({ ...realState, ...mockState })}>
            <MemoryRouter>
              <MotebookingContainer />
            </MemoryRouter>
          </Provider>
        </QueryClientProvider>
      );

      expect(
        screen.getByRole("heading", {
          name: "Møteforespørsel",
        })
      ).to.exist;
    });
  });
});
