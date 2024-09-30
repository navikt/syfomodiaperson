import { renderHook, waitFor } from "@testing-library/react";
import { expect, describe, it, beforeEach } from "vitest";
import { queryHookWrapper } from "./queryHookTestUtils";
import { stubOppfolgingstilfellePersonApi } from "../stubs/stubIsoppfolgingstilfelle";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { testQueryClient } from "../testQueryClient";

let queryClient: any;

describe("oppfolgingstilfellePersonQueryHooks tests", () => {
  beforeEach(() => {
    queryClient = testQueryClient();
  });

  it("loads oppfolgingstilfeller for valgt personident", async () => {
    stubOppfolgingstilfellePersonApi();

    const wrapper = queryHookWrapper(queryClient);

    const { result } = renderHook(() => useOppfolgingstilfellePersonQuery(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).to.be.true);

    expect(result.current.latestOppfolgingstilfelle).to.exist;
    expect(result.current.hasActiveOppfolgingstilfelle).to.be.true;
  });
});
