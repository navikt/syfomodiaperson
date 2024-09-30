import { renderHook, waitFor } from "@testing-library/react";
import { expect, describe, it, beforeEach } from "vitest";
import {
  useAktivVeilederinfoQuery,
  useVeilederInfoQuery,
} from "@/data/veilederinfo/veilederinfoQueryHooks";
import { stubVeilederinfoApi } from "../stubs/stubSyfoveileder";
import { queryHookWrapper } from "./queryHookTestUtils";
import { testQueryClient } from "../testQueryClient";
import {
  VEILEDER_DEFAULT,
  VEILEDER_IDENT_DEFAULT,
} from "@/mocks/common/mockConstants";

let queryClient: any;

describe("veilederinfoQueryHooks tests", () => {
  beforeEach(() => {
    queryClient = testQueryClient();
  });

  it("loads aktiv veilederinfo", async () => {
    const wrapper = queryHookWrapper(queryClient);

    const { result } = renderHook(() => useAktivVeilederinfoQuery(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).to.be.true);

    expect(result.current.data).to.deep.equal(VEILEDER_DEFAULT);
  });

  it("loads veilederinfo for ident", async () => {
    stubVeilederinfoApi();

    const wrapper = queryHookWrapper(queryClient);

    const { result } = renderHook(
      () => useVeilederInfoQuery(VEILEDER_IDENT_DEFAULT),
      {
        wrapper,
      }
    );

    await waitFor(() => expect(result.current.isSuccess).to.be.true);

    expect(result.current.data).to.deep.equal(VEILEDER_DEFAULT);
  });
});
