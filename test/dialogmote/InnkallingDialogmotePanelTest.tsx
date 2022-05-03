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
import { getButton, queryButton } from "../testUtils";
import { dialogmotekandidatQueryKeys } from "@/data/dialogmotekandidat/dialogmotekandidatQueryHooks";
import { ARBEIDSTAKER_DEFAULT } from "../../mock/common/mockConstants";
import { dialogmotekandidatMock } from "../../mock/isdialogmotekandidat/dialogmotekandidatMock";

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
    it("viser knapp til Dialogmoteinkalling når bruker ikke kan varsles", () => {
      renderInnkallingDialogmotePanel(brukerKanIkkeVarsles);

      const button = getButton("Nytt dialogmøte");
      expect(button).to.exist;
      userEvent.click(button);
    });

    it("viser ingen advarsel når bruker kan varsles", () => {
      renderInnkallingDialogmotePanel(brukerKanVarsles);

      expect(screen.queryByRole("img", { name: "advarsel-ikon" })).to.not.exist;
      expect(screen.queryByRole(brukerKanIkkeVarslesTekst)).to.not.exist;
    });
    it("viser knapp til Dialogmoteinkalling  når bruker kan varsles", () => {
      renderInnkallingDialogmotePanel(brukerKanVarsles);

      const button = getButton("Nytt dialogmøte");
      expect(button).to.exist;
      userEvent.click(button);
    });
    it("viser ikke knapp til DialogmoteUnntak når bruker ikke er Dialogmotekandidat", () => {
      renderInnkallingDialogmotePanel(brukerKanVarsles);

      expect(queryButton("Sett unntak")).to.not.exist;
    });
    it("viser knapp til DialogmoteUnntak når bruker er Dialogmotekandidat", () => {
      queryClient.setQueryData(
        dialogmotekandidatQueryKeys.kandidat(ARBEIDSTAKER_DEFAULT.personIdent),
        () => dialogmotekandidatMock
      );

      renderInnkallingDialogmotePanel(brukerKanVarsles);

      const button = getButton("Sett unntak");
      expect(button).to.exist;
      userEvent.click(button);
    });
  });
});
