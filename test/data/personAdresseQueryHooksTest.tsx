import { stubPersonadresseApi } from "../stubs/stubSyfoperson";
import { queryHookWrapper } from "./queryHookTestUtils";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { usePersonAdresseQuery } from "@/data/personinfo/personAdresseQueryHooks";
import { personAdresseMock } from "@/mocks/syfoperson/personAdresseMock";
import { testQueryClient } from "../testQueryClient";

let queryClient: any;

describe("personAdresseQueryHooks", () => {
  beforeEach(() => {
    queryClient = testQueryClient();
  });

  it("loads personadresse for valgt personident", async () => {
    stubPersonadresseApi();
    const wrapper = queryHookWrapper(queryClient);

    const { result } = renderHook(() => usePersonAdresseQuery(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.data).to.not.be.undefined);

    expect(result.current.data).to.deep.equal(personAdresseMock);
  });
});
