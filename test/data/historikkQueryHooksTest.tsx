import { queryHookWrapper } from "./queryHookTestUtils";
import { renderHook, waitFor } from "@testing-library/react";
import {
  useHistorikkMotebehovQuery,
  useHistorikkOppfolgingsplan,
} from "@/data/historikk/historikkQueryHooks";
import { expect, describe, it, beforeEach } from "vitest";
import { historikkmotebehovMock } from "@/mocks/syfomotebehov/historikkmotebehovMock";
import { historikkoppfolgingsplanMock } from "@/mocks/syfooppfolgingsplanservice/historikkoppfolgingsplanMock";
import { stubMotebehovHistorikkApi } from "../stubs/stubSyfomotebehov";
import { stubOppfolgingsplanHistorikkApi } from "../stubs/stubSyfooppfolgingsplan";
import { testQueryClient } from "../testQueryClient";

let queryClient: any;

describe("historikkQueryHooks", () => {
  beforeEach(() => {
    queryClient = testQueryClient();
  });

  it("loads motebehov-historikk for valgt personident", async () => {
    stubMotebehovHistorikkApi();
    const wrapper = queryHookWrapper(queryClient);

    const { result } = renderHook(() => useHistorikkMotebehovQuery(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).to.be.true);

    const expectedHistorikkEvents = [...historikkmotebehovMock].map(
      (historikkEvent) => ({
        ...historikkEvent,
        kilde: "MOTEBEHOV",
      })
    );

    expect(result.current.data).to.deep.equal(expectedHistorikkEvents);
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
