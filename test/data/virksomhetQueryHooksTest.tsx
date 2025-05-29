import { stubVirksomhetApi } from "../stubs/stubEreg";
import { renderHook, waitFor } from "@testing-library/react";
import { useVirksomhetQuery } from "@/data/virksomhet/virksomhetQueryHooks";
import { beforeEach, describe, expect, it } from "vitest";
import { virksomhetMock } from "@/mocks/ereg/virksomhetMock";
import { queryHookWrapper } from "./queryHookTestUtils";
import { VIRKSOMHET_PONTYPANDY } from "@/mocks/common/mockConstants";
import { testQueryClient } from "../testQueryClient";

let queryClient: any;

const orgnummer = VIRKSOMHET_PONTYPANDY.virksomhetsnummer;

describe("virksomhetQueryHooks tests", () => {
  beforeEach(() => {
    queryClient = testQueryClient();
  });

  it("loads virksomhet for orgnummer", async () => {
    stubVirksomhetApi(orgnummer);

    const wrapper = queryHookWrapper(queryClient);

    const { result } = renderHook(() => useVirksomhetQuery(orgnummer), {
      wrapper,
    });

    await waitFor(() => expect(result.current.data).to.not.be.undefined);
    expect(result.current.data).to.deep.equal(virksomhetMock());
  });
});
