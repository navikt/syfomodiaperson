import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import { arbeidstaker } from "../dialogmote/testData";
import { expect } from "chai";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import { createStore } from "redux";
import { rootReducer } from "@/data/rootState";
import configureStore from "redux-mock-store";
import VedtakContainer from "@/components/vedtak/container/VedtakContainer";

const realState = createStore(rootReducer).getState();
const store = configureStore([]);
const queryClient = new QueryClient();
const mockState = {
  navbruker: {
    data: {
      navn: arbeidstaker.navn,
      kontaktinfo: {
        fnr: arbeidstaker.personident,
      },
    },
  },
};

describe("VedtakContainer", () => {
  it("viser spinnsyn-lenke til vedtak", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Provider store={store({ ...realState, ...mockState })}>
          <MemoryRouter>
            <VedtakContainer />
          </MemoryRouter>
        </Provider>
      </QueryClientProvider>
    );

    const link = screen.getByRole("link", {
      name: `Se vedtakene slik ${arbeidstaker.navn} ser dem på nav.no`,
    });
    expect(link.getAttribute("href")).to.contain("spinnsyn-frontend-interne");
    expect(link.getAttribute("href")).to.contain("/syk/sykepenger");
  });
});
