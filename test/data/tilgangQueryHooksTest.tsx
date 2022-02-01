import { QueryClient } from "react-query";
import { apiMock } from "../stubs/stubApi";
import nock from "nock";
import { renderHook } from "@testing-library/react-hooks";
import { expect } from "chai";
import { queryHookWrapper } from "./queryHookTestUtils";
import { stubTilgangApi } from "../stubs/stubSyfotilgangskontroll";
import { useTilgangQuery } from "@/data/tilgang/tilgangQueryHooks";
import { tilgangBrukerMock } from "../../mock/data/tilgangtilbrukerMock";

let queryClient;
let apiMockScope;

describe("tilgangQueryHooks tests", () => {
  beforeEach(() => {
    queryClient = new QueryClient();
    apiMockScope = apiMock();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  it("loads tilgang for valgt personident", async () => {
    stubTilgangApi(apiMockScope, tilgangBrukerMock);

    const wrapper = queryHookWrapper(queryClient);

    const { result, waitFor } = renderHook(() => useTilgangQuery(), {
      wrapper,
    });

    await waitFor(() => result.current.isSuccess);
    expect(result.current.data).to.deep.equal(tilgangBrukerMock);
  });
});
