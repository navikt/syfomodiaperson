import { queryHookWrapper } from "./queryHookTestUtils";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { stubDiskresjonskodeApi } from "../stubs/stubSyfoperson";
import { useDiskresjonskodeQuery } from "@/data/diskresjonskode/diskresjonskodeQueryHooks";
import { testQueryClient } from "../testQueryClient";

let queryClient: any;

describe("diskresjonskodeQueryHooks tests", () => {
  beforeEach(() => {
    queryClient = testQueryClient();
  });

  it("loads diskresjonskode for valgt personident", async () => {
    stubDiskresjonskodeApi("7");
    const wrapper = queryHookWrapper(queryClient);

    const { result } = renderHook(() => useDiskresjonskodeQuery(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.data).to.not.be.undefined);

    expect(result.current.data).to.deep.equal("7");
  });
});
