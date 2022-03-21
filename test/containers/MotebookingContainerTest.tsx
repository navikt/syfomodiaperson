import React from "react";
import { expect } from "chai";
import { MotebookingContainer } from "@/components/mote/container/MotebookingContainer";
import { createStore } from "redux";
import { rootReducer } from "@/data/rootState";
import { QueryClientProvider } from "react-query";
import configureStore from "redux-mock-store";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { ARBEIDSTAKER_DEFAULT } from "../../mock/common/mockConstants";
import { MemoryRouter } from "react-router-dom";
import { queryClientWithMockData } from "../testQueryClient";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { Tilgang } from "@/data/tilgang/tilgangTypes";

const harIkkeMoterTilgang: Tilgang = {
  harTilgang: false,
};
const realState = createStore(rootReducer).getState();
const fnr = ARBEIDSTAKER_DEFAULT.personIdent;
let queryClient;

const renderMotebookingContainer = (mockStore) =>
  render(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: "2221", setValgtEnhet: () => void 0 }}
      >
        <Provider store={mockStore}>
          <MemoryRouter>
            <MotebookingContainer />
          </MemoryRouter>
        </Provider>
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>
  );

describe("MotebookingContainer", () => {
  let store;
  let mockState;
  beforeEach(() => {
    queryClient = queryClientWithMockData();
    store = configureStore([]);
    mockState = {};
  });

  describe("MotebookingSide", () => {
    it("Skal vise AppSpinner", async () => {
      renderMotebookingContainer(store({ ...realState, ...mockState }));

      expect(await screen.findByLabelText("Vent litt mens siden laster")).to
        .exist;
    });
    it("Skal hente møter ved init", () => {
      const mockStore = store({ ...realState, ...mockState });
      renderMotebookingContainer(mockStore);

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
      renderMotebookingContainer(store({ ...realState, ...mockState }));

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
      renderMotebookingContainer(store({ ...realState, ...mockState }));

      expect(
        screen.getByRole("heading", {
          name: "Du har ikke tilgang til denne tjenesten",
        })
      ).to.exist;
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
      renderMotebookingContainer(store({ ...realState, ...mockState }));

      expect(
        screen.getByRole("heading", {
          name: "Forrige møte",
        })
      ).to.exist;
    });
  });
});
