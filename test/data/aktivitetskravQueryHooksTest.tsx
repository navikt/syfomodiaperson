import { queryHookWrapper } from "./queryHookTestUtils";
import { renderHook, waitFor } from "@testing-library/react";
import { expect, describe, it, beforeEach } from "vitest";
import { useAktivitetskravQuery } from "@/data/aktivitetskrav/aktivitetskravQueryHooks";
import { aktivitetskravMock } from "@/mocks/isaktivitetskrav/aktivitetskravMock";
import { stubAktivitetskravApi } from "../stubs/stubIsaktivitetskrav";
import { stubFeatureTogglesApi } from "../stubs/stubUnleash";
import { testQueryClient } from "../testQueryClient";

let queryClient;

describe("aktivitetskravqueryHook tests", () => {
  beforeEach(() => {
    queryClient = testQueryClient();
  });

  it("loads aktivitetskrav for valgt personident", async () => {
    stubFeatureTogglesApi();
    stubAktivitetskravApi();

    const wrapper = queryHookWrapper(queryClient);

    const { result } = renderHook(() => useAktivitetskravQuery(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).to.be.true);

    expect(result.current.data).to.not.be.undefined;
    expect(result.current.data?.length).to.equal(aktivitetskravMock.length);
  });
});
