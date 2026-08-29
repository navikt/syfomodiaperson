import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { queryHookWrapper } from "./queryHookTestUtils";
import {
  useGetLPSOppfolgingsplanerQuery,
  useGetOppfolgingsplanerV2Query,
} from "@/sider/oppfolgingsplan/hooks/oppfolgingsplanQueryHooks";
import {
  stubGetOppfolgingsplanV2,
  stubOppfolgingsplanLPSApi,
} from "../stubs/stubSyfooppfolgingsplan";
import { testQueryClient } from "../testQueryClient";
import { oppfolgingsplanerLPSMock } from "@/mocks/lps-oppfolgingsplan-mottak/oppfolgingsplanLPSMock";
import { oppfolgingsplanV2Mock } from "@/mocks/syfooppfolgingsplanbackend/oppfolgingsplanV2Mock";
import { ARBEIDSTAKER_DEFAULT } from "@/mocks/common/mockConstants";

let queryClient: any;

const today = new Date();

describe("oppfolgingsplanQueryHooks tests", () => {
  beforeEach(() => {
    queryClient = testQueryClient();
  });

  it("loads oppfolgingsplaner v2 for valgt personident", async () => {
    const requestSpy = vi.fn();
    stubGetOppfolgingsplanV2(requestSpy);

    const wrapper = queryHookWrapper(queryClient);

    const { result } = renderHook(() => useGetOppfolgingsplanerV2Query(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.data).to.not.be.empty);
    expect(result.current.data).to.deep.equal(oppfolgingsplanV2Mock);
    expect(requestSpy).toHaveBeenCalledWith({
      sykmeldtFnr: ARBEIDSTAKER_DEFAULT.personIdent,
    });
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
