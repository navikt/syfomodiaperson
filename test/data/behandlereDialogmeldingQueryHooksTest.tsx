import { QueryClient } from "react-query";
import { apiMock } from "../stubs/stubApi";
import nock from "nock";
import { queryHookWrapper } from "./queryHookTestUtils";
import { renderHook } from "@testing-library/react-hooks";
import { expect } from "chai";
import { stubBehandlereDialogmeldingApi } from "../stubs/stubIsdialogmelding";
import { useBehandlereDialogmeldingQuery } from "@/data/behandlerdialogmelding/behandlereDialogmeldingQueryHooks";
import { behandlereDialogmeldingMock } from "../../mock/isdialogmelding/behandlereDialogmeldingMock";

let queryClient;
let apiMockScope;

describe("behandlereDialogmeldingQueryHooks tests", () => {
  beforeEach(() => {
    queryClient = new QueryClient();
    apiMockScope = apiMock();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  it("loads behandlere for valgt personident", async () => {
    stubBehandlereDialogmeldingApi(apiMockScope);
    const wrapper = queryHookWrapper(queryClient);

    const { result, waitFor } = renderHook(
      () => useBehandlereDialogmeldingQuery(),
      {
        wrapper,
      }
    );

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data).to.deep.equal(behandlereDialogmeldingMock);
  });
});
