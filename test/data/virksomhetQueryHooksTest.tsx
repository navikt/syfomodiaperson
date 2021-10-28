import { stubVirksomhetApi } from "../stubs/stubSyfomoteadmin";
import { QueryClient } from "react-query";
import { apiMock } from "../stubs/stubApi";
import nock from "nock";
import { renderHook } from "@testing-library/react-hooks";
import { useVirksomhetQuery } from "@/data/virksomhet/virksomhetQueryHooks";
import { expect } from "chai";
import { virksomhetMock } from "../../mock/data/virksomhetMock";
import { queryHookWrapper } from "./queryHookTestUtils";

let queryClient;
let apiMockScope;

const orgnummer = "110110110";

describe("virksomhetQueryHooks tests", () => {
  beforeEach(() => {
    queryClient = new QueryClient();
    apiMockScope = apiMock();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  it("loads virksomhet for orgnummer", async () => {
    stubVirksomhetApi(apiMockScope, orgnummer);

    const wrapper = queryHookWrapper(queryClient);

    const { result, waitFor } = renderHook(
      () => useVirksomhetQuery(orgnummer),
      { wrapper }
    );

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data).to.deep.equal(virksomhetMock());
  });
});
