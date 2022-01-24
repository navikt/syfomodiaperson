import { render, screen } from "@testing-library/react";
import configureStore from "redux-mock-store";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import React from "react";
import DialogmoteInnkallingTekster, {
  texts,
} from "@/components/dialogmote/innkalling/DialogmoteInnkallingTekster";
import { Form } from "react-final-form";
import { arbeidstaker } from "./testData";
import { expect } from "chai";

const store = configureStore([]);
const queryClient = new QueryClient();

const renderDialogmoteInnkallingTekster = (navBrukerKanVarsles: boolean) => {
  const mockState = {
    navbruker: {
      data: {
        kontaktinfo: {
          skalHaVarsel: navBrukerKanVarsles,
        },
      },
    },
    valgtbruker: {
      personident: arbeidstaker.personident,
    },
  };

  render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <Provider store={store(mockState)}>
          <Form
            onSubmit={() => {
              /* Do nothing */
            }}
          >
            {() => (
              <DialogmoteInnkallingTekster selectedBehandler={undefined} />
            )}
          </Form>
        </Provider>
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
