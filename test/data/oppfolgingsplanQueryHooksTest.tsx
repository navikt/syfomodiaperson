import { renderHook, waitFor } from "@testing-library/react";
import { expect, describe, it, beforeEach } from "vitest";
import { queryHookWrapper } from "./queryHookTestUtils";
import {
  useDokumentinfoQuery,
  useOppfolgingsplanerLPSQuery,
  useOppfolgingsplanerQuery,
} from "@/data/oppfolgingsplan/oppfolgingsplanQueryHooks";
import { oppfolgingsplanMock } from "@/mocks/syfooppfolgingsplanservice/oppfolgingsplanMock";
import {
  stubDokumentinfoApi,
  stubOppfolgingsplanApi,
  stubOppfolgingsplanLPSApi,
} from "../stubs/stubSyfooppfolgingsplan";
import { dokumentinfoMock } from "@/mocks/syfooppfolgingsplanservice/dokumentinfoMock";
import { testQueryClient } from "../testQueryClient";
import { oppfolgingsplanerLPSMock } from "@/mocks/lps-oppfolgingsplan-mottak/oppfolgingsplanLPSMock";

let queryClient: any;

const today = new Date();

describe("oppfolgingsplanQueryHooks tests", () => {
  beforeEach(() => {
    queryClient = testQueryClient();
  });

  it("loads oppfolgingsplaner for valgt personident", async () => {
    stubOppfolgingsplanApi();

    const wrapper = queryHookWrapper(queryClient);

    const { result } = renderHook(() => useOppfolgingsplanerQuery(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).to.be.true);

    expect(result.current.data).to.deep.equal(oppfolgingsplanMock);
  });

  it("loads oppfolgingsplaner lps for valgt personident", async () => {
    stubOppfolgingsplanLPSApi(today);

    const wrapper = queryHookWrapper(queryClient);

    const { result } = renderHook(() => useOppfolgingsplanerLPSQuery(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).to.be.true);

    expect(result.current.data).to.deep.equal(oppfolgingsplanerLPSMock(today));
  });

  it("loads dokumentinfo for oppfolgingsplan", async () => {
    const oppfolgingsplanId = 10;
    stubDokumentinfoApi(oppfolgingsplanId);

    const wrapper = queryHookWrapper(queryClient);

    const { result } = renderHook(
      () => useDokumentinfoQuery(oppfolgingsplanId),
      {
        wrapper,
      }
    );

    await waitFor(() => expect(result.current.isSuccess).to.be.true);

    expect(result.current.data).to.deep.equal(dokumentinfoMock);
  });
});
