import { QueryClient } from "react-query";
import { renderHook } from "@testing-library/react-hooks";
import nock from "nock";
import { apiMock } from "../stubs/stubApi";
import { expect } from "chai";
import { queryHookWrapper } from "./queryHookTestUtils";
import { stubPersoninfoApi } from "../stubs/stubSyfoperson";
import { useBrukerinfoQuery } from "@/data/navbruker/navbrukerQueryHooks";
import { brukerinfoMock } from "../../mock/syfoperson/brukerinfoMock";

let queryClient: any;
let apiMockScope: any;

describe("navbrukerQueryHooks", () => {
  beforeEach(() => {
    queryClient = new QueryClient();
    apiMockScope = apiMock();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  it("loads brukerinfo for valgt personident", async () => {
    stubPersoninfoApi(apiMockScope);
    const wrapper = queryHookWrapper(queryClient);

    const { result, waitFor } = renderHook(() => useBrukerinfoQuery(), {
      wrapper,
    });

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data).to.deep.equal(brukerinfoMock);
  });
});
