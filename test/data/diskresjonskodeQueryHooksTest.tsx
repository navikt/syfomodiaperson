import { QueryClient } from "react-query";
import { apiMock } from "../stubs/stubApi";
import nock from "nock";
import { queryHookWrapper } from "./queryHookTestUtils";
import { renderHook } from "@testing-library/react-hooks";
import { expect } from "chai";
import { stubDiskresjonskodeApi } from "../stubs/stubSyfoperson";
import { useDiskresjonskodeQuery } from "@/data/diskresjonskode/diskresjonskodeQueryHooks";

let queryClient: any;
let apiMockScope: any;

describe("diskresjonskodeQueryHooks tests", () => {
  beforeEach(() => {
    queryClient = new QueryClient();
    apiMockScope = apiMock();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  it("loads diskresjonskode for valgt personident", async () => {
    stubDiskresjonskodeApi(apiMockScope, "7");
    const wrapper = queryHookWrapper(queryClient);

    const { result, waitFor } = renderHook(() => useDiskresjonskodeQuery(), {
      wrapper,
    });

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data).to.deep.equal("7");
  });
});
