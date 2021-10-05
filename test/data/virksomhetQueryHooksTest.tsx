import { stubVirksomhetApi } from "../stubs/stubSyfomoteadmin";
import { QueryClient, QueryClientProvider } from "react-query";
import { apiMock } from "../stubs/stubApi";
import nock from "nock";
import React from "react";
import { renderHook } from "@testing-library/react-hooks";
import { useVirksomhetQuery } from "@/data/virksomhet/virksomhetQueryHooks";
import { expect } from "chai";

let queryClient;
let apiMockScope;

const orgnummer = "110110110";

describe("virksomhetQueryHooks tests", () => {
  beforeEach(() => {
    queryClient = new QueryClient();
    apiMockScope = apiMock();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  it("loads virksomhet for orgnummer", async () => {
    stubVirksomhetApi(apiMockScope, orgnummer);

    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result, waitFor } = renderHook(
      () => useVirksomhetQuery(orgnummer),
      { wrapper }
    );

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data).to.deep.equal({ navn: "Fire Station" });
  });
});
