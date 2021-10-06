import { QueryClient, QueryClientProvider } from "react-query";
import { apiMock } from "../stubs/stubApi";
import nock from "nock";
import { renderHook } from "@testing-library/react-hooks";
import { expect } from "chai";
import React from "react";
import { stubVedtakApi } from "../stubs/stubVedtakApi";
import { useVedtakQuery } from "@/data/vedtak/vedtakQueryHooks";
import { vedtakMock } from "../../mock/data/vedtakMock";

const fnr = "05087321470";
let queryClient;
let apiMockScope;

describe("vedtakQueryHooks tests", () => {
  beforeEach(() => {
    queryClient = new QueryClient();
    apiMockScope = apiMock();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  it("loads vedtak for fnr", async () => {
    stubVedtakApi(apiMockScope, fnr);

    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result, waitFor } = renderHook(() => useVedtakQuery(fnr), {
      wrapper,
    });

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data).to.deep.equal(vedtakMock);
  });
});
