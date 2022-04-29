import { QueryClient } from "react-query";
import { apiMock } from "../stubs/stubApi";
import nock from "nock";
import { renderHook } from "@testing-library/react-hooks";
import { expect } from "chai";
import { queryHookWrapper } from "./queryHookTestUtils";
import { usePersonoppgaverQuery } from "@/data/personoppgave/personoppgaveQueryHooks";
import { stubPersonoppgaveApi } from "../stubs/stubIspersonoppgave";
import { personoppgaverMock } from "../../mock/ispersonoppgave/personoppgaveMock";

let queryClient;
let apiMockScope;

const today = new Date();

describe("personoppgaveQueryHooks tests", () => {
  beforeEach(() => {
    queryClient = new QueryClient();
    apiMockScope = apiMock();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  it("loads personoppgaver for valgt personident", async () => {
    stubPersonoppgaveApi(apiMockScope, today);

    const wrapper = queryHookWrapper(queryClient);

    const { result, waitFor } = renderHook(() => usePersonoppgaverQuery(), {
      wrapper,
    });

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data).to.deep.equal(personoppgaverMock(today));
  });
});
