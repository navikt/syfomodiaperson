import { expect } from "chai";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import React from "react";
import { InnkallingDialogmotePanel } from "@/components/mote/components/innkalling/InnkallingDialogmotePanel";
import { texts as brukerKanIkkeVarslesPapirpostTexts } from "../../src/components/dialogmote/BrukerKanIkkeVarslesPapirpostAdvarsel";
import { createStore } from "redux";
import { rootReducer } from "@/data/rootState";
import configureStore from "redux-mock-store";
import { brukerKanIkkeVarslesTekst } from "@/components/BrukerKanIkkeVarslesText";
import { QueryClient, QueryClientProvider } from "react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { navEnhet } from "./testData";
import { queryClientWithMockData } from "../testQueryClient";

let queryClient: QueryClient;

const realState = createStore(rootReducer).getState();
const store = configureStore([]);
const brukerKanVarsles = {
  data: {
    kontaktinfo: {
      skalHaVarsel: true,
    },
  },
};
const brukerKanIkkeVarsles = {
  data: {
    kontaktinfo: {
      skalHaVarsel: false,
    },
  },
};

const renderInnkallingDialogmotePanel = (navbruker) => {
  return render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <ValgtEnhetContext.Provider
          value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
        >
          <Provider
            store={store({
              ...realState,
              navbruker: navbruker,
            })}
          >
            <InnkallingDialogmotePanel aktivtDialogmote={undefined} />
          </Provider>
        </ValgtEnhetContext.Provider>
      </QueryClientProvider>
    </MemoryRouter>
  );
};

describe("InnkallingDialogmotePanel", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  describe("med dm2 enabled", () => {
    it("viser advarsel om fysisk brev når bruker ikke kan varsles", () => {
      renderInnkallingDialogmotePanel(brukerKanIkkeVarsles);

      expect(screen.getByRole("img", { name: "advarsel-ikon" })).to.exist;
      expect(screen.getByText(brukerKanIkkeVarslesTekst)).to.exist;
      expect(
        screen.getByText(brukerKanIkkeVarslesPapirpostTexts.papirpostDialogmote)
      ).to.exist;
    });
    it("Nytt dialogmøte-knapp viser modaler når bruker ikke kan varsles", () => {
      renderInnkallingDialogmotePanel(brukerKanIkkeVarsles);

      const button = screen.getByRole("button", { name: "Nytt dialogmøte" });
      expect(button).to.exist;
      expect(screen.queryByRole("link", { name: "Nytt dialogmøte" })).to.not
        .exist;
      userEvent.click(button);
      expect(
        screen.getByRole("dialog", {
          name: "Ny løsning for innkalling til Dialogmøte",
        })
      ).to.exist;
    });

    it("viser ingen advarsel når bruker kan varsles", () => {
      renderInnkallingDialogmotePanel(brukerKanVarsles);

      expect(screen.queryByRole("img", { name: "advarsel-ikon" })).to.not.exist;
      expect(screen.queryByRole(brukerKanIkkeVarslesTekst)).to.not.exist;
    });
    it("Nytt dialogmøte-knapp viser modal når bruker kan varsles", () => {
      renderInnkallingDialogmotePanel(brukerKanVarsles);

      const button = screen.getByRole("button", { name: "Nytt dialogmøte" });
      expect(button).to.exist;
      expect(screen.queryByRole("link", { name: "Nytt dialogmøte" })).to.not
        .exist;
      userEvent.click(button);
      expect(
        screen.getByRole("dialog", {
          name: "Ny løsning for innkalling til Dialogmøte",
        })
      ).to.exist;
    });
  });
});
