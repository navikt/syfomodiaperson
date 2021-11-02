import { QueryClient } from "react-query";
import { apiMock } from "../stubs/stubApi";
import nock from "nock";
import { queryHookWrapper } from "./queryHookTestUtils";
import { renderHook } from "@testing-library/react-hooks";
import { expect } from "chai";
import { stubBehandlereDialogmeldingApi } from "../stubs/stubIsdialogmelding";
import { useBehandlereDialogmeldingQuery } from "@/data/behandlerdialogmelding/behandlereDialogmeldingQueryHooks";
import { behandlereDialogmeldingMock } from "../../mock/isdialogmelding/behandlereDialogmeldingMock";
import { ToggleNames } from "@/data/unleash/unleash_types";

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

  it("loads behandlere for valgt personident if dm2innkallingFastlege is toggled on", async () => {
    const mockStateWithFastlegeEnabled = {
      unleash: {
        toggles: {
          [ToggleNames.dm2InnkallingFastlege]: true,
        },
      },
    };

    stubBehandlereDialogmeldingApi(apiMockScope);
    const wrapper = queryHookWrapper(queryClient, mockStateWithFastlegeEnabled);

    const { result, waitFor } = renderHook(
      () => useBehandlereDialogmeldingQuery(),
      {
        wrapper,
      }
    );

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data).to.deep.equal(behandlereDialogmeldingMock);
  });

  it("doesn't load behandlere for valgt personident if dm2innkallingFastlege is toggled off", async () => {
    const mockStateWithFastlegeDisabled = {
      unleash: {
        toggles: {
          [ToggleNames.dm2InnkallingFastlege]: false,
        },
      },
    };

    stubBehandlereDialogmeldingApi(apiMockScope);
    const wrapper = queryHookWrapper(
      queryClient,
      mockStateWithFastlegeDisabled
    );

    const { result } = renderHook(() => useBehandlereDialogmeldingQuery(), {
      wrapper,
    });

    expect(result.current.isIdle).to.be.true;
  });
});
