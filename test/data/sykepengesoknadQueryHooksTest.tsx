import { QueryClient } from "react-query";
import { apiMock } from "../stubs/stubApi";
import nock from "nock";
import { personident, queryHookWrapper } from "./queryHookTestUtils";
import { renderHook } from "@testing-library/react-hooks";
import { expect } from "chai";
import {
  parseSoknad,
  useSykepengesoknaderQuery,
} from "@/data/sykepengesoknad/sykepengesoknadQueryHooks";
import { soknaderMock } from "../../mock/data/soknaderMock";
import { stubSyfosoknadApi } from "../stubs/stubSyfosoknad";
import { SykepengesoknadDTO } from "@/data/sykepengesoknad/types/SykepengesoknadDTO";

let queryClient;
let apiMockScope;

describe("sykepengesoknadQueryHooks", () => {
  beforeEach(() => {
    queryClient = new QueryClient();
    apiMockScope = apiMock();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  it("loads sykepengesoknader", async () => {
    stubSyfosoknadApi(apiMockScope, personident);
    const wrapper = queryHookWrapper(queryClient);

    const { result, waitFor } = renderHook(() => useSykepengesoknaderQuery(), {
      wrapper,
    });

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data).to.deep.equal(
      ((soknaderMock as unknown) as SykepengesoknadDTO[]).map(parseSoknad)
    );
  });
});
