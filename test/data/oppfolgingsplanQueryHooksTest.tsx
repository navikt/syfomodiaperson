import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { queryHookWrapper } from "./queryHookTestUtils";
import {
  useGetLPSOppfolgingsplanerQuery,
  useGetOppfolgingsplanerQuery,
} from "@/sider/oppfolgingsplan/hooks/oppfolgingsplanQueryHooks";
import { oppfolgingsplanMock } from "@/mocks/syfooppfolgingsplanservice/oppfolgingsplanMock";
import {
  stubOppfolgingsplanApi,
  stubOppfolgingsplanLPSApi,
} from "../stubs/stubSyfooppfolgingsplan";
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

    const { result } = renderHook(() => useGetOppfolgingsplanerQuery(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.data).to.not.be.empty);
    expect(result.current.data).to.deep.equal(oppfolgingsplanMock);
  });

  it("loads oppfolgingsplaner lps for valgt personident", async () => {
    stubOppfolgingsplanLPSApi(today);

    const wrapper = queryHookWrapper(queryClient);

    const { result } = renderHook(() => useGetLPSOppfolgingsplanerQuery(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.data).to.not.be.empty);
    expect(result.current.data).to.deep.equal(oppfolgingsplanerLPSMock(today));
  });
});
