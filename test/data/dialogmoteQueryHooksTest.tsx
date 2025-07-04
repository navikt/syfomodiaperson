import { stubDialogmoterApi } from "../stubs/stubIsdialogmote";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useDialogmoterQuery } from "@/sider/dialogmoter/hooks/dialogmoteQueryHooks";
import { dialogmoterMock } from "@/mocks/isdialogmote/dialogmoterMock";
import { queryHookWrapper } from "./queryHookTestUtils";
import { testQueryClient } from "../testQueryClient";

let queryClient: any;

describe("dialogmoteQueryHooks tests", () => {
  beforeEach(() => {
    queryClient = testQueryClient();
  });

  it("loads dialogmoter for valgt personident", async () => {
    stubDialogmoterApi();

    const wrapper = queryHookWrapper(queryClient);

    const { result } = renderHook(() => useDialogmoterQuery(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.data).to.not.be.empty);
    expect(result.current.data).to.deep.equal(dialogmoterMock);
  });
});
