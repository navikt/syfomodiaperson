import { renderHook, waitFor } from "@testing-library/react";
import { expect, describe, it, beforeEach } from "vitest";
import { stubBehandlendeEnhetApi } from "../stubs/stubSyfobehandlendeEnhet";
import { useBehandlendeEnhetQuery } from "@/data/behandlendeenhet/behandlendeEnhetQueryHooks";
import { behandlendeEnhetMock } from "@/mocks/syfobehandlendeenhet/behandlendeEnhetMock";
import { queryHookWrapper } from "./queryHookTestUtils";
import { testQueryClient } from "../testQueryClient";

let queryClient: any;

describe("behandlendeEnhetQueryHooks tests", () => {
  beforeEach(() => {
    queryClient = testQueryClient();
  });

  it("loads behandlende enhet for valgt personident", async () => {
    stubBehandlendeEnhetApi(behandlendeEnhetMock);
    const wrapper = queryHookWrapper(queryClient);

    const { result } = renderHook(() => useBehandlendeEnhetQuery(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).to.be.true);

    expect(result.current.data).to.deep.equal(behandlendeEnhetMock);
  });
});
