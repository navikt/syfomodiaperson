import { QueryClient } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it } from "vitest";
import { NAV_PERSONIDENT_HEADER } from "@/api/axios";
import { SYFOPERSON_ROOT } from "@/apiConstants";
import { aapQueryKeys, useAapStatusQuery } from "@/data/aap/aapQueryHooks";
import { AapStatusDTO } from "@/data/aap/aapTypes";
import { modiacontextQueryKeys } from "@/data/modiacontext/modiacontextQueryHooks";
import { AKTIV_BRUKER_DEFAULT } from "@/mocks/common/mockConstants";
import { mockServer } from "../setup";
import { testQueryClient } from "../testQueryClient";
import { queryHookWrapper } from "./queryHookTestUtils";

const aapStatus: AapStatusDTO = {
  soknader: [
    {
      sakid: "sak-1",
      soknadsdatoer: ["2026-08-01"],
      statuskode: "UNDER_BEHANDLING",
      erAktiv: true,
    },
  ],
  vedtak: [
    {
      sakid: "sak-1",
      kilde: "KELVIN",
      vedtaksdato: "2026-08-15",
      perioder: [
        {
          fraOgMedDato: "2026-08-01",
          tilOgMedDato: null,
        },
      ],
      erAktivt: true,
    },
  ],
};

let queryClient: QueryClient;

describe("aapQueryHooks", () => {
  beforeEach(() => {
    queryClient = testQueryClient();
  });

  it("posts personident in body without personident header", async () => {
    let requestBody: unknown;
    let personidentHeader: string | null = null;
    mockServer.use(
      http.post(
        `*${SYFOPERSON_ROOT}/person/aap-saker/query`,
        async ({ request }) => {
          requestBody = await request.json();
          personidentHeader = request.headers.get(NAV_PERSONIDENT_HEADER);
          return HttpResponse.json(aapStatus);
        },
      ),
    );
    const wrapper = queryHookWrapper(queryClient);

    const { result } = renderHook(() => useAapStatusQuery(), { wrapper });

    await waitFor(() => expect(result.current.data).toEqual(aapStatus));

    expect(requestBody).toEqual({
      personident: AKTIV_BRUKER_DEFAULT.aktivBruker,
    });
    expect(personidentHeader).toBeNull();
    expect(
      queryClient.getQueryData(
        aapQueryKeys.aapStatus(AKTIV_BRUKER_DEFAULT.aktivBruker ?? ""),
      ),
    ).toEqual(aapStatus);
  });

  it("is disabled without selected person", () => {
    const wrapper = queryHookWrapper(queryClient);
    queryClient.setQueryData(modiacontextQueryKeys.aktivbruker, {
      aktivBruker: "",
    });

    const { result } = renderHook(() => useAapStatusQuery(), {
      wrapper,
    });

    expect(result.current.fetchStatus).toBe("idle");
    expect(result.current.data).toBeUndefined();
  });
});
