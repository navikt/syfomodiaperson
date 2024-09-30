import { testQueryClient } from "../../testQueryClient";
import { stubFeatureTogglesApi } from "../../stubs/stubUnleash";
import { queryHookWrapper } from "../queryHookTestUtils";
import { renderHook, waitFor } from "@testing-library/react";
import { useFeatureToggles } from "@/data/unleash/unleashQueryHooks";
import { expect, describe, it, beforeEach } from "vitest";
import { mockUnleashResponse } from "@/mocks/unleashMocks";

let queryClient: any;

describe("unleashQuery tests", () => {
  beforeEach(() => {
    queryClient = testQueryClient();
  });

  it("loads unleash toggles", async () => {
    stubFeatureTogglesApi();

    const wrapper = queryHookWrapper(queryClient);

    const { result } = renderHook(() => useFeatureToggles(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).to.be.true);
    expect(result.current.toggles).to.deep.equal(mockUnleashResponse);
  });
});
