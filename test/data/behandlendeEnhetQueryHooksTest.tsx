import { QueryClient, QueryClientProvider } from "react-query";
import { apiMock } from "../stubs/stubApi";
import nock from "nock";
import { renderHook } from "@testing-library/react-hooks";
import { expect } from "chai";
import React from "react";
import { stubBehandlendeEnhetApi } from "../stubs/stubSyfobehandlendeEnhet";
import { useBehandlendeEnhetQuery } from "@/data/behandlendeenhet/behandlendeEnhetQueryHooks";
import { behandlendeEnhetMock } from "../../mock/data/behandlendeEnhetMock";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";

const store = configureStore([]);
const mockState = {
  valgtbruker: {
    personident: "05087321470",
  },
};
let queryClient;
let apiMockScope;

describe("behandlendeEnhetQueryHooks tests", () => {
  beforeEach(() => {
    queryClient = new QueryClient();
    apiMockScope = apiMock();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  it("loads behandlende enhet for valgt personident", async () => {
    stubBehandlendeEnhetApi(apiMockScope, behandlendeEnhetMock);

    const wrapper = ({ children }) => (
      <Provider store={store(mockState)}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </Provider>
    );

    const { result, waitFor } = renderHook(() => useBehandlendeEnhetQuery(), {
      wrapper,
    });

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data).to.deep.equal(behandlendeEnhetMock);
  });
});
