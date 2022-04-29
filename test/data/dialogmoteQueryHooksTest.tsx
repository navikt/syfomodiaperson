import { QueryClient } from "react-query";
import { apiMock } from "../stubs/stubApi";
import nock from "nock";
import { stubDialogmoterApi } from "../stubs/stubIsdialogmote";
import { renderHook } from "@testing-library/react-hooks";
import { expect } from "chai";
import { useDialogmoterQuery } from "@/data/dialogmote/dialogmoteQueryHooks";
import { dialogmoterMock } from "../../mock/isdialogmote/dialogmoterMock";
import { queryHookWrapper } from "./queryHookTestUtils";

let queryClient;
let apiMockScope;

describe("dialogmoteQueryHooks tests", () => {
  beforeEach(() => {
    queryClient = new QueryClient();
    apiMockScope = apiMock();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  it("loads dialogmoter for valgt personident", async () => {
    stubDialogmoterApi(apiMockScope);

    const wrapper = queryHookWrapper(queryClient);

    const { result, waitFor } = renderHook(() => useDialogmoterQuery(), {
      wrapper,
    });

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data).to.deep.equal(dialogmoterMock);
  });
});
