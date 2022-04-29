import { QueryClient } from "react-query";
import { apiMock } from "../stubs/stubApi";
import nock from "nock";
import { renderHook } from "@testing-library/react-hooks";
import { expect } from "chai";
import { queryHookWrapper } from "./queryHookTestUtils";
import {
  useDokumentinfoQuery,
  useOppfolgingsplanerLPSQuery,
  useOppfolgingsplanerQuery,
} from "@/data/oppfolgingsplan/oppfolgingsplanQueryHooks";
import { oppfolgingsplanMock } from "../../mock/syfooppfolgingsplanservice/oppfolgingsplanMock";
import {
  stubDokumentinfoApi,
  stubOppfolgingsplanApi,
  stubOppfolgingsplanLPSApi,
} from "../stubs/stubSyfooppfolgingsplan";
import { oppfolgingsplanerLPSMock } from "../../mock/syfooppfolgingsplanservice/oppfolgingsplanLPSMock";
import { dokumentinfoMock } from "../../mock/syfooppfolgingsplanservice/dokumentinfoMock";
import { ARBEIDSTAKER_DEFAULT } from "../../mock/common/mockConstants";

let queryClient;
let apiMockScope;

const today = new Date();

describe("oppfolgingsplanQueryHooks tests", () => {
  beforeEach(() => {
    queryClient = new QueryClient();
    apiMockScope = apiMock();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  it("loads oppfolgingsplaner for valgt personident", async () => {
    stubOppfolgingsplanApi(apiMockScope, ARBEIDSTAKER_DEFAULT.personIdent);

    const wrapper = queryHookWrapper(queryClient);

    const { result, waitFor } = renderHook(() => useOppfolgingsplanerQuery(), {
      wrapper,
    });

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data).to.deep.equal(oppfolgingsplanMock);
  });

  it("loads oppfolgingsplaner lps for valgt personident", async () => {
    stubOppfolgingsplanLPSApi(apiMockScope, today);

    const wrapper = queryHookWrapper(queryClient);

    const { result, waitFor } = renderHook(
      () => useOppfolgingsplanerLPSQuery(),
      {
        wrapper,
      }
    );

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data).to.deep.equal(oppfolgingsplanerLPSMock(today));
  });

  it("loads dokumentinfo for oppfolgingsplan", async () => {
    const oppfolgingsplanId = 10;
    stubDokumentinfoApi(apiMockScope, oppfolgingsplanId);

    const wrapper = queryHookWrapper(queryClient);

    const { result, waitFor } = renderHook(
      () => useDokumentinfoQuery(oppfolgingsplanId),
      {
        wrapper,
      }
    );

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data).to.deep.equal(dokumentinfoMock);
  });
});
