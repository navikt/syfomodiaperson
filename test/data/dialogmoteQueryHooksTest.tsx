import { QueryClient, QueryClientProvider } from "react-query";
import { apiMock } from "../stubs/stubApi";
import nock from "nock";
import { stubDialogmoterApi } from "../stubs/stubIsdialogmote";
import { renderHook } from "@testing-library/react-hooks";
import { expect } from "chai";
import React from "react";
import { useDialogmoterQuery } from "@/data/dialogmote/dialogmoteQueryHooks";
import { dialogmoterMock } from "../../mock/data/dialogmoterMock";

const fnr = "05087321470";
let queryClient;
let apiMockScope;

describe("dialogmoteQueryHooks tests", () => {
  beforeEach(() => {
    queryClient = new QueryClient();
    apiMockScope = apiMock();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  it("loads dialogmoter for fnr", async () => {
    stubDialogmoterApi(apiMockScope);

    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result, waitFor } = renderHook(() => useDialogmoterQuery(fnr), {
      wrapper,
    });

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data).to.deep.equal(dialogmoterMock);
  });
});
