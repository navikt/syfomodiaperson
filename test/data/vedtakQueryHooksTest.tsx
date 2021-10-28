import { QueryClient } from "react-query";
import { apiMock } from "../stubs/stubApi";
import nock from "nock";
import { renderHook } from "@testing-library/react-hooks";
import { expect } from "chai";
import { stubVedtakApi } from "../stubs/stubVedtakApi";
import { useVedtakQuery } from "@/data/vedtak/vedtakQueryHooks";
import { vedtakMock } from "../../mock/data/vedtakMock";
import { personident, queryHookWrapper } from "./queryHookTestUtils";

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

  it("loads vedtak for valgt personident", async () => {
    stubVedtakApi(apiMockScope, personident);

    const wrapper = queryHookWrapper(queryClient);

    const { result, waitFor } = renderHook(() => useVedtakQuery(), {
      wrapper,
    });

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data).to.deep.equal(vedtakMock);
  });
});
