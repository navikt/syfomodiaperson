import { render, screen } from "@testing-library/react";
import UtdragFraSykefravaeret from "@/components/utdragFraSykefravaeret/UtdragFraSykefravaeret";
import React from "react";
import { createStore } from "redux";
import { rootReducer } from "@/data/rootState";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "react-query";
import { expect } from "chai";
import {
  ARBEIDSTAKER_DEFAULT,
  ARBEIDSTAKER_DEFAULT_FULL_NAME,
} from "../../mock/common/mockConstants";

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

describe("UtdragFraSykefravaeret", () => {
  it("viser spinnsyn-lenke til vedtak", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Provider store={store({ ...realState, ...mockState })}>
          <UtdragFraSykefravaeret
            aktivePlaner={[]}
            fnr={ARBEIDSTAKER_DEFAULT.personIdent}
          />
        </Provider>
      </QueryClientProvider>
    );

    expect(screen.getByRole("heading", { name: "Vedtak" })).to.exist;
    const link = screen.getByRole("link", {
      name: `Se vedtakene slik ${ARBEIDSTAKER_DEFAULT_FULL_NAME} ser dem på nav.no`,
    });
    expect(link.getAttribute("href")).to.contain("spinnsyn-frontend-interne");
    expect(link.getAttribute("href")).to.contain("/syk/sykepenger");
  });
});
