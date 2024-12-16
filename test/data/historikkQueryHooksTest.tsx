import { queryHookWrapper } from "./queryHookTestUtils";
import { renderHook, waitFor } from "@testing-library/react";
import { useHistorikkOppfolgingsplan } from "@/data/historikk/historikkQueryHooks";
import { beforeEach, describe, expect, it } from "vitest";
import { historikkoppfolgingsplanMock } from "@/mocks/syfooppfolgingsplanservice/historikkoppfolgingsplanMock";
import { stubOppfolgingsplanHistorikkApi } from "../stubs/stubSyfooppfolgingsplan";
import { testQueryClient } from "../testQueryClient";

let queryClient: any;

describe("historikkQueryHooks", () => {
  beforeEach(() => {
    queryClient = testQueryClient();
  });

  it("loads oppfolgingsplan-historikk for valgt personident", async () => {
    stubOppfolgingsplanHistorikkApi();
    const wrapper = queryHookWrapper(queryClient);

    const { result } = renderHook(() => useHistorikkOppfolgingsplan(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).to.be.true);

    const expectedHistorikkEvents = [...historikkoppfolgingsplanMock].map(
      (historikkEvent) => ({
        ...historikkEvent,
        kilde: "OPPFOLGINGSPLAN",
      })
    );

    expect(result.current.data).to.deep.equal(expectedHistorikkEvents);
  });
});
