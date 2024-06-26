import { apiMock } from "../stubs/stubApi";
import nock from "nock";
import { renderHook, waitFor } from "@testing-library/react";
import { expect, describe, it, beforeEach, afterEach } from "vitest";
import { stubFastlegerApi } from "../stubs/stubFastlegeRest";
import { useFastlegerQuery } from "@/data/fastlege/fastlegerQueryHooks";
import { fastlegerMock } from "../../mock/fastlegerest/fastlegerMock";
import { queryHookWrapper } from "./queryHookTestUtils";
import { testQueryClient } from "../testQueryClient";

let queryClient: any;
let apiMockScope: any;

describe("fastlegerQueryHooks tests", () => {
  beforeEach(() => {
    queryClient = testQueryClient();
    apiMockScope = apiMock();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  it("loads fastleger for valgt personident", async () => {
    stubFastlegerApi(apiMockScope);

    const wrapper = queryHookWrapper(queryClient);

    const { result } = renderHook(() => useFastlegerQuery(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).to.be.true);

    expect(result.current.data).to.deep.equal(fastlegerMock);
    expect(result.current.fastlege).to.deep.equal(fastlegerMock[0]);
    expect(result.current.fastlegeVikarer).to.deep.equal([
      fastlegerMock[1],
      fastlegerMock[2],
    ]);
  });
});
