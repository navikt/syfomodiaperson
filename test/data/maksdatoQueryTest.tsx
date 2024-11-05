import { queryHookWrapper } from "./queryHookTestUtils";
import { renderHook, waitFor } from "@testing-library/react";
import { expect, describe, it, beforeEach } from "vitest";
import { testQueryClient } from "../testQueryClient";
import { useMaksdatoQuery } from "@/data/maksdato/useMaksdatoQuery";
import { maksdato, maksdatoMock } from "@/mocks/syfoperson/persondataMock";
import { stubMaxdateApi } from "../stubs/stubSykepengerdagerInformasjon";

let queryClient: any;

describe("maksdatoQuery", () => {
  beforeEach(() => {
    queryClient = testQueryClient();
  });

  it("loads maksdatoDTO for valgt personident", async () => {
    stubMaxdateApi(maksdato);
    const wrapper = queryHookWrapper(queryClient);

    const { result } = renderHook(() => useMaksdatoQuery(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).to.be.true);

    expect(result.current.data).to.deep.equal(maksdatoMock);
  });
});
