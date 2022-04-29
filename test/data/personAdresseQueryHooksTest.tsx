import { QueryClient } from "react-query";
import { apiMock } from "../stubs/stubApi";
import nock from "nock";
import { stubPersonadresseApi } from "../stubs/stubSyfoperson";
import { queryHookWrapper } from "./queryHookTestUtils";
import { renderHook } from "@testing-library/react-hooks";
import { expect } from "chai";
import { usePersonAdresseQuery } from "@/data/personinfo/personAdresseQueryHooks";
import { personAdresseMock } from "../../mock/syfoperson/personAdresseMock";

let queryClient;
let apiMockScope;

describe("personAdresseQueryHooks", () => {
  beforeEach(() => {
    queryClient = new QueryClient();
    apiMockScope = apiMock();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  it("loads personadresse for valgt personident", async () => {
    stubPersonadresseApi(apiMockScope);
    const wrapper = queryHookWrapper(queryClient);

    const { result, waitFor } = renderHook(() => usePersonAdresseQuery(), {
      wrapper,
    });

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data).to.deep.equal(personAdresseMock);
  });
});
