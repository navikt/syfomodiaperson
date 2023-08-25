import nock from "nock";
import { apiMock } from "../../stubs/stubApi";
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

  // it("loads unleash toggles", async () => {
  //   stubAktivVeilederinfoApi(apiMockScope);
  //   stubFeatureTogglesApi(apiMockScope);
  //
  //   const wrapper = queryHookWrapper(queryClient);
  //
  //   const { result } = renderHook(() => useFeatureToggles(), {
  //     wrapper,
  //   });
  //
  //   await waitFor(() => {
  //     console.log(`RESULT ${JSON.stringify(result.current)}`);
  //     expect(result.current.isSuccess).to.be.true;
  //   });
  //   console.log(`UNLEASH MOCK: ${unleashMock}`);
  //   expect(result.current.toggles).to.deep.equal(unleashMock);
  // });
});
