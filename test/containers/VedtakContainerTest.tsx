import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import { expect } from "chai";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import { createStore } from "redux";
import { rootReducer } from "@/data/rootState";
import configureStore from "redux-mock-store";
import VedtakContainer from "@/components/vedtak/container/VedtakContainer";
import {
  ARBEIDSTAKER_DEFAULT,
  ARBEIDSTAKER_DEFAULT_FULL_NAME,
} from "../../mock/common/mockConstants";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";

const realState = createStore(rootReducer).getState();
const store = configureStore([]);
const queryClient = new QueryClient();
const mockState = {
  navbruker: {
    data: {
      navn: ARBEIDSTAKER_DEFAULT_FULL_NAME,
      kontaktinfo: {
        fnr: ARBEIDSTAKER_DEFAULT.personIdent,
      },
    },
  },
};

describe("VedtakContainer", () => {
  it("viser spinnsyn-lenke til vedtak", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ValgtEnhetContext.Provider
          value={{ valgtEnhet: "", setValgtEnhet: () => void 0 }}
        >
          <Provider store={store({ ...realState, ...mockState })}>
            <MemoryRouter>
              <VedtakContainer />
            </MemoryRouter>
          </Provider>
        </ValgtEnhetContext.Provider>
      </QueryClientProvider>
    );

    const link = screen.getByRole("link", {
      name: `Se vedtakene slik ${ARBEIDSTAKER_DEFAULT_FULL_NAME} ser dem på nav.no`,
    });
    expect(link.getAttribute("href")).to.contain("spinnsyn-frontend-interne");
    expect(link.getAttribute("href")).to.contain("/syk/sykepenger");
  });
});
