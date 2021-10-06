import { QueryClient, QueryClientProvider } from "react-query";
import { apiMock } from "../stubs/stubApi";
import nock from "nock";
import React from "react";
import { renderHook } from "@testing-library/react-hooks";
import { expect } from "chai";
import { useVeilederinfoQuery } from "@/data/veilederinfo/veilederinfoQueryHooks";
import { stubVeilederinfoApi } from "../stubs/stubSyfoveileder";
import { veilederMock } from "../../mock/data/veilederMock";

let queryClient;
let apiMockScope;

describe("veilederinfoQueryHooks tests", () => {
  beforeEach(() => {
    queryClient = new QueryClient();
    apiMockScope = apiMock();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  it("loads veilederinfo", async () => {
    stubVeilederinfoApi(apiMockScope);

    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result, waitFor } = renderHook(() => useVeilederinfoQuery(), {
      wrapper,
    });

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data).to.deep.equal(veilederMock);
  });
});
