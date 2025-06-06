import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { queryHookWrapper } from "./queryHookTestUtils";
import { stubTilgangApi } from "../stubs/stubIstilgangskontroll";
import { useTilgangQuery } from "@/data/tilgang/tilgangQueryHooks";
import { tilgangBrukerMock } from "@/mocks/istilgangskontroll/tilgangtilbrukerMock";
import { testQueryClient } from "../testQueryClient";

let queryClient: any;

describe("tilgangQueryHooks tests", () => {
  beforeEach(() => {
    queryClient = testQueryClient();
  });

  it("loads tilgang for valgt personident", async () => {
    stubTilgangApi(tilgangBrukerMock);

    const wrapper = queryHookWrapper(queryClient);

    const { result } = renderHook(() => useTilgangQuery(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.data).to.not.be.undefined);
    expect(result.current.data).to.deep.equal(tilgangBrukerMock);
  });
});
