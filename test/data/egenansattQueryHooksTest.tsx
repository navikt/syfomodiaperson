import { QueryClient } from "react-query";
import { apiMock } from "../stubs/stubApi";
import nock from "nock";
import { queryHookWrapper } from "./queryHookTestUtils";
import { renderHook } from "@testing-library/react-hooks";
import { expect } from "chai";
import { stubEgenansattApi } from "../stubs/stubSyfoperson";
import { useEgenansattQuery } from "@/data/egenansatt/egenansattQueryHooks";

let queryClient;
let apiMockScope;

describe("egenansattQueryHooks tests", () => {
  beforeEach(() => {
    queryClient = new QueryClient();
    apiMockScope = apiMock();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  it("loads egenansatt for valgt personident", async () => {
    stubEgenansattApi(apiMockScope, true);
    const wrapper = queryHookWrapper(queryClient);

    const { result, waitFor } = renderHook(() => useEgenansattQuery(), {
      wrapper,
    });

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data).to.deep.equal(true);
  });
});
