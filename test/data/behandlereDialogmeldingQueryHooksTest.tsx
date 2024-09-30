import { queryHookWrapper } from "./queryHookTestUtils";
import { renderHook, waitFor } from "@testing-library/react";
import { expect, describe, it, beforeEach } from "vitest";
import { stubBehandlereDialogmeldingApi } from "../stubs/stubIsdialogmelding";
import { behandlereDialogmeldingMock } from "@/mocks/isdialogmelding/behandlereDialogmeldingMock";
import { useBehandlereQuery } from "@/data/behandler/behandlereQueryHooks";
import { testQueryClient } from "../testQueryClient";

let queryClient: any;

describe("behandlereQueryHooks tests", () => {
  beforeEach(() => {
    queryClient = testQueryClient();
  });

  it("loads behandlere for valgt personident", async () => {
    stubBehandlereDialogmeldingApi();
    const wrapper = queryHookWrapper(queryClient);

    const { result } = renderHook(() => useBehandlereQuery(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).to.be.true);

    expect(result.current.data).to.deep.equal(behandlereDialogmeldingMock);
  });
});
