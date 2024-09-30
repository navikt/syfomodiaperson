import { queryHookWrapper } from "./queryHookTestUtils";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import {
  parseSoknad,
  useSykepengesoknaderQuery,
} from "@/data/sykepengesoknad/sykepengesoknadQueryHooks";
import { soknaderMock } from "@/mocks/sykepengesoknad/soknaderMock";
import { stubSykepengesoknadBackendApi } from "../stubs/stubSykepengesoknadBackend";
import { SykepengesoknadDTO } from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import { testQueryClient } from "../testQueryClient";

let queryClient: any;

describe("sykepengesoknadQueryHooks", () => {
  beforeEach(() => {
    queryClient = testQueryClient();
  });

  it("loads sykepengesoknader", async () => {
    stubSykepengesoknadBackendApi();
    const wrapper = queryHookWrapper(queryClient);

    const { result } = renderHook(() => useSykepengesoknaderQuery(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).to.be.true);

    expect(result.current.data).to.deep.equal(
      (soknaderMock as unknown as SykepengesoknadDTO[]).map(parseSoknad)
    );
  });
});
