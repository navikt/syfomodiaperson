import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { queryHookWrapper } from "./queryHookTestUtils";
import { stubPersoninfoApi } from "../stubs/stubSyfoperson";
import { useBrukerinfoQuery } from "@/data/navbruker/navbrukerQueryHooks";
import { testQueryClient } from "../testQueryClient";
import { brukerinfoMock } from "@/mocks/syfoperson/persondataMock";

let queryClient: any;

describe("navbrukerQueryHooks", () => {
  beforeEach(() => {
    queryClient = testQueryClient();
  });

  it("loads brukerinfo for valgt personident", async () => {
    stubPersoninfoApi();
    const wrapper = queryHookWrapper(queryClient);

    const { result } = renderHook(() => useBrukerinfoQuery(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.data).to.not.be.undefined);
    expect(result.current.data).to.deep.equal(brukerinfoMock);
  });
});
