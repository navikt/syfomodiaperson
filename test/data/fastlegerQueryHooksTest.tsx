import { QueryClient } from "react-query";
import { apiMock } from "../stubs/stubApi";
import nock from "nock";
import { renderHook } from "@testing-library/react-hooks";
import { expect } from "chai";
import { stubFastlegerApi } from "../stubs/stubFastlegeRest";
import { useFastlegerQuery } from "@/data/fastlege/fastlegerQueryHooks";
import { fastlegerMock } from "../../mock/fastlegerest/fastlegerMock";
import { queryHookWrapper } from "./queryHookTestUtils";
import { ARBEIDSTAKER_DEFAULT } from "../../mock/common/mockConstants";

let queryClient;
let apiMockScope;

describe("fastlegerQueryHooks tests", () => {
  beforeEach(() => {
    queryClient = new QueryClient();
    apiMockScope = apiMock();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  it("loads fastleger for valgt personident", async () => {
    stubFastlegerApi(apiMockScope, ARBEIDSTAKER_DEFAULT.personIdent);

    const wrapper = queryHookWrapper(queryClient);

    const { result, waitFor } = renderHook(() => useFastlegerQuery(), {
      wrapper,
    });

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data).to.deep.equal(fastlegerMock);
    expect(result.current.fastlege).to.deep.equal(fastlegerMock[0]);
    expect(result.current.fastlegeVikarer).to.deep.equal([
      fastlegerMock[1],
      fastlegerMock[2],
    ]);
  });
});
