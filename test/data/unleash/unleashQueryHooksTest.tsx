import nock from "nock";
import { expect } from "chai";
import { renderHook, waitFor } from "@testing-library/react";
import { apiMock } from "../../stubs/stubApi";
import { queryHookWrapper } from "../queryHookTestUtils";
import { unleashMock } from "../../../mock/unleash/unleashMock";
import { stubFeatureTogglesApi } from "../../stubs/stubUnleash";
import { stubAktivVeilederinfoApi } from "../../stubs/stubSyfoveileder";
import { useFeatureToggles } from "@/data/unleash/unleashQueryHooks";
import { testQueryClient } from "../../testQueryClient";

let queryClient: any;
let apiMockScope: any;

describe("unleashQuery tests", () => {
  beforeEach(() => {
    queryClient = testQueryClient();
    apiMockScope = apiMock();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  it("loads unleash toggles", async () => {
    stubAktivVeilederinfoApi(apiMockScope);
    stubFeatureTogglesApi(apiMockScope);

    const wrapper = queryHookWrapper(queryClient);

    const { result } = renderHook(() => useFeatureToggles(), {
      wrapper,
    });
    console.log(`RESULT ${result.current.toggles}`);
    console.log(`RESULT ${result.current.isSuccess}`);

    await waitFor(() => expect(result.current.isSuccess).to.be.true);
    console.log(`UNLEASH MOCK: ${unleashMock}`);
    expect(result.current.toggles).to.deep.equal(unleashMock);
  });
});
