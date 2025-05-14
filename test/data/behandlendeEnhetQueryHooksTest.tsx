import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { stubBehandlendeEnhetApi } from "../stubs/stubSyfobehandlendeEnhet";
import { useBehandlendeEnhetQuery } from "@/data/behandlendeenhet/behandlendeEnhetQueryHooks";
import { behandlendeEnhetMockResponse } from "@/mocks/syfobehandlendeenhet/behandlendeEnhetMock";
import { queryHookWrapper } from "./queryHookTestUtils";
import { testQueryClient } from "../testQueryClient";

let queryClient: any;

describe("behandlendeEnhetQueryHooks tests", () => {
  beforeEach(() => {
    queryClient = testQueryClient();
  });

  it("loads behandlende enhet for valgt personident", async () => {
    stubBehandlendeEnhetApi(behandlendeEnhetMockResponse);
    const wrapper = queryHookWrapper(queryClient);

    const { result } = renderHook(() => useBehandlendeEnhetQuery(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).to.be.true);

    expect(result.current.data?.geografiskEnhet).to.deep.equal(
      behandlendeEnhetMockResponse.geografiskEnhet
    );
    expect(result.current.data?.oppfolgingsenhetDTO?.enhet).to.deep.equal(
      behandlendeEnhetMockResponse.oppfolgingsenhetDTO.enhet
    );
  });
});
