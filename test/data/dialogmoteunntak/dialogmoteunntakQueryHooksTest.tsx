import { expect, describe, it, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { queryHookWrapper } from "../queryHookTestUtils";
import { dialogmotekandidatMock } from "@/mocks/isdialogmotekandidat/dialogmotekandidatMock";
import { stubDialogmoteKandidatApi } from "../../stubs/stubIsdialogmotekandidat";
import { stubFeatureTogglesApi } from "../../stubs/stubUnleash";
import { useDialogmotekandidat } from "@/data/dialogmotekandidat/dialogmotekandidatQueryHooks";
import { testQueryClient } from "../../testQueryClient";

let queryClient: any;

describe("dialogmotekandidatQuery tests", () => {
  beforeEach(() => {
    queryClient = testQueryClient();
  });

  it("loads dialogmotekandidat for valgt personident", async () => {
    stubFeatureTogglesApi();
    stubDialogmoteKandidatApi();

    const wrapper = queryHookWrapper(queryClient);

    const { result } = renderHook(() => useDialogmotekandidat(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).to.be.true);

    expect(result.current.data).to.deep.equal(dialogmotekandidatMock);
  });
});
