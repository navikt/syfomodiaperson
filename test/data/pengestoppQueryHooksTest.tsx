import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { queryHookWrapper } from "./queryHookTestUtils";
import { usePengestoppStatusQuery } from "@/data/pengestopp/pengestoppQueryHooks";
import { createStatusList } from "@/mocks/ispengestopp/pengestoppStatusMock";
import { stubPengestoppStatusApi } from "../stubs/stubIspengestopp";
import { testQueryClient } from "../testQueryClient";

let queryClient: any;

const today = new Date();

describe("pengestoppQueryHooks tests", () => {
  beforeEach(() => {
    queryClient = testQueryClient();
  });

  it("loads pengestopp status for valgt personident", async () => {
    stubPengestoppStatusApi(today);

    const wrapper = queryHookWrapper(queryClient);

    const { result } = renderHook(() => usePengestoppStatusQuery(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.data).to.not.be.empty);
    expect(result.current.data).to.deep.equal(createStatusList(today));
  });
});
