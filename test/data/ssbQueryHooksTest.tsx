import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import React, { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SYFOPERSON_ROOT } from "@/apiConstants";
import { NaringskodeStandard } from "@/data/virksomhet/Naringskode";
import { useNaringskodeQuery } from "@/data/virksomhet/ssbQueryHooks";
import { mockNaringskode } from "@/mocks/syfoperson/mockNaringskode";
import { mockServer } from "../setup";

interface Props {
  children: ReactNode;
}

describe("useNaringskodeQuery", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    mockServer.use(mockNaringskode);
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
  });

  function Wrapper({ children }: Props) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }

  it("fetches hierarchies and caches each standard separately", async () => {
    const standards: NaringskodeStandard[] = [1994, 2002, 2007, 2025];
    const handler = vi.fn(({ request }: { request: Request }) =>
      HttpResponse.json({
        standard: Number(new URL(request.url).searchParams.get("standard")),
        hierarki: [],
      }),
    );
    mockServer.use(http.get(`*${SYFOPERSON_ROOT}/naringskode/62`, handler));

    const { result, rerender } = renderHook(
      ({ standard }: { standard: NaringskodeStandard }) =>
        useNaringskodeQuery("62", standard),
      { initialProps: { standard: 1994 }, wrapper: Wrapper },
    );

    for (const standard of standards) {
      rerender({ standard });

      await waitFor(() => expect(result.current.data?.standard).toBe(standard));
      expect(result.current.isSuccess).toBe(true);
    }

    for (const standard of standards) {
      rerender({ standard });

      expect(result.current.data?.standard).toBe(standard);
      expect(result.current.isFetching).toBe(false);
    }
    expect(handler).toHaveBeenCalledTimes(4);
  });

  it.each([
    {
      standard: 1994 as const,
      kode: "01.410",
      codes: ["01.410", "01.41", "01.4", "01", "A_", "A"],
    },
    {
      standard: 2002 as const,
      kode: "71.330",
      codes: ["71.330", "71.33", "71.3", "71", "K_", "K"],
    },
    {
      standard: 2007 as const,
      kode: "62.020",
      codes: ["62.020", "62.02", "62.0", "62", "J"],
    },
    {
      standard: 2025 as const,
      kode: "62.200",
      codes: ["62.200", "62.20", "62.2", "62", "K"],
    },
  ])(
    "fetches the full hierarchy for $standard",
    async ({ standard, kode, codes }) => {
      const { result } = renderHook(() => useNaringskodeQuery(kode, standard), {
        wrapper: Wrapper,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data?.hierarki.map(({ code }) => code)).toEqual(
        codes,
      );
      expect(result.current.data?.standard).toBe(standard);
    },
  );

  it.each([
    { standard: 1994 as const, kode: "A_", codes: ["A_", "A"] },
    { standard: 2002 as const, kode: "K_", codes: ["K_", "K"] },
    { standard: 2007 as const, kode: "62", codes: ["62", "J"] },
    { standard: 2025 as const, kode: "62", codes: ["62", "K"] },
  ])(
    "fetches the parent hierarchy for $kode in $standard",
    async ({ standard, kode, codes }) => {
      const { result } = renderHook(() => useNaringskodeQuery(kode, standard), {
        wrapper: Wrapper,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data?.hierarki.map(({ code }) => code)).toEqual(
        codes,
      );
    },
  );

  it("does not fetch without a code", () => {
    const handler = vi.fn(() => HttpResponse.json({}));
    mockServer.use(http.get(`*${SYFOPERSON_ROOT}/naringskode/*`, handler));

    const { result } = renderHook(() => useNaringskodeQuery("", 2025), {
      wrapper: Wrapper,
    });

    expect(result.current.fetchStatus).toBe("idle");
    expect(result.current.data).toBeUndefined();
    expect(handler).not.toHaveBeenCalled();
  });

  it.each([404, 502])("exposes API errors (%s)", async (status) => {
    mockServer.use(
      http.get(`*${SYFOPERSON_ROOT}/naringskode/62.200`, () =>
        HttpResponse.json({}, { status }),
      ),
    );

    const { result } = renderHook(() => useNaringskodeQuery("62.200", 2025), {
      wrapper: Wrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.data).toBeUndefined();
  });
});
