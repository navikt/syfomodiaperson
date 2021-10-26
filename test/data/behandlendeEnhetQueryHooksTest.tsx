import { QueryClient, QueryClientProvider } from "react-query";
import { apiMock } from "../stubs/stubApi";
import nock from "nock";
import { renderHook } from "@testing-library/react-hooks";
import { expect } from "chai";
import React from "react";
import { stubBehandlendeEnhetApi } from "../stubs/stubSyfobehandlendeEnhet";
import { useBehandlendeEnhetQuery } from "@/data/behandlendeenhet/behandlendeEnhetQueryHooks";
import { behandlendeEnhetMock } from "../../mock/data/behandlendeEnhetMock";

const fnr = "05087321470";
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

  it("loads behandlende enhet for fnr", async () => {
    stubBehandlendeEnhetApi(apiMockScope, behandlendeEnhetMock);

    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result, waitFor } = renderHook(
      () => useBehandlendeEnhetQuery(fnr),
      {
        wrapper,
      }
    );

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data).to.deep.equal(behandlendeEnhetMock);
  });
});
