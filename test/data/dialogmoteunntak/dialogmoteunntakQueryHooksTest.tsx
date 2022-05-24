import { QueryClient } from "react-query";
import nock from "nock";
import { expect } from "chai";
import { renderHook } from "@testing-library/react-hooks";
import { apiMock } from "../../stubs/stubApi";
import { queryHookWrapper } from "../queryHookTestUtils";
import { dialogmotekandidatMock } from "../../../mock/isdialogmotekandidat/dialogmotekandidatMock";
import { stubDialogmoteKandidatApi } from "../../stubs/stubIsdialogmotekandidat";
import { stubFeatureTogglesApi } from "../../stubs/stubUnleash";
import { useDialogmotekandidat } from "@/data/dialogmotekandidat/dialogmotekandidatQueryHooks";
import { stubVeilederinfoApi } from "../../stubs/stubSyfoveileder";

let queryClient: any;
let apiMockScope: any;

describe("dialogmotekandidatQuery tests", () => {
  beforeEach(() => {
    queryClient = new QueryClient();
    apiMockScope = apiMock();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  it("loads dialogmotekandidat for valgt personident", async () => {
    stubVeilederinfoApi(apiMockScope);
    stubFeatureTogglesApi(apiMockScope);
    stubDialogmoteKandidatApi(apiMockScope);

    const wrapper = queryHookWrapper(queryClient);

    const { result, waitFor } = renderHook(() => useDialogmotekandidat(), {
      wrapper,
    });

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data).to.deep.equal(dialogmotekandidatMock);
  });
});
