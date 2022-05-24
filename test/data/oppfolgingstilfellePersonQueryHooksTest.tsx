import { QueryClient } from "react-query";
import { apiMock } from "../stubs/stubApi";
import nock from "nock";
import { renderHook } from "@testing-library/react-hooks";
import { expect } from "chai";
import { queryHookWrapper } from "./queryHookTestUtils";
import { stubOppfolgingstilfellePersonApi } from "../stubs/stubIsoppfolgingstilfelle";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";

let queryClient: any;
let apiMockScope: any;

describe("oppfolgingstilfellePersonQueryHooks tests", () => {
  beforeEach(() => {
    queryClient = new QueryClient();
    apiMockScope = apiMock();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  it("loads oppfolgingstilfeller for valgt personident", async () => {
    stubOppfolgingstilfellePersonApi(apiMockScope);

    const wrapper = queryHookWrapper(queryClient);

    const { result, waitFor } = renderHook(
      () => useOppfolgingstilfellePersonQuery(),
      {
        wrapper,
      }
    );

    await waitFor(() => result.current.isSuccess);

    expect(result.current.latestOppfolgingstilfelle).to.exist;
    expect(result.current.hasActiveOppfolgingstilfelle).to.be.true;
  });
});
