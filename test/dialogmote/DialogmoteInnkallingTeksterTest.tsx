import { render, screen } from "@testing-library/react";
import configureStore from "redux-mock-store";
import { MemoryRouter } from "react-router-dom";
import { QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import React from "react";
import DialogmoteInnkallingTekster, {
  texts,
} from "@/components/dialogmote/innkalling/DialogmoteInnkallingTekster";
import { Form } from "react-final-form";
import { expect } from "chai";
import { queryClientWithAktivBruker } from "../testQueryClient";
import { navEnhet } from "./testData";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";

const store = configureStore([]);
const queryClient = queryClientWithAktivBruker();

const renderDialogmoteInnkallingTekster = (navBrukerKanVarsles: boolean) => {
  const mockState = {
    navbruker: {
      data: {
        kontaktinfo: {
          skalHaVarsel: navBrukerKanVarsles,
        },
      },
    },
  };

  render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <ValgtEnhetContext.Provider
          value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
        >
          <Provider store={store(mockState)}>
            <Form
              onSubmit={() => {
                /* Do nothing */
              }}
            >
              {() => (
                <DialogmoteInnkallingTekster
                  selectedBehandler={undefined}
                  visAlternativTekst={false}
                />
              )}
            </Form>
          </Provider>
        </ValgtEnhetContext.Provider>
      </QueryClientProvider>
    </MemoryRouter>
  );
};

describe("DialogmoteInnkallingTekster", () => {
  it("viser advarsel om papirpost når bruker ikke kan varsles digitalt", () => {
    renderDialogmoteInnkallingTekster(false);

    expect(screen.getByRole("img", { name: "advarsel-ikon" })).to.exist;
    expect(screen.getByText(texts.reservertAlert)).to.exist;
  });
  it("viser ikke advarsel om papirpost når bruker kan varsles digitalt", () => {
    renderDialogmoteInnkallingTekster(true);

    expect(screen.queryByRole("img", { name: "advarsel-ikon" })).to.not.exist;
    expect(screen.queryByText(texts.reservertAlert)).to.not.exist;
  });
});
