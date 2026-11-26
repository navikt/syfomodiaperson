import { renderHook, waitFor } from "@testing-library/react";
import {
  useVirksomhetQuery,
  useVirksomheterQueries,
  virksomhetQueryKeys,
} from "@/data/virksomhet/virksomhetQueryHooks";
import { EregVirksomhetDTO } from "@/data/virksomhet/types/EregOrganisasjonResponseDTO";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { EREG_ROOT } from "@/apiConstants";
import { http, HttpResponse } from "msw";
import { mockServer } from "../setup";
import { beforeEach, describe, expect, it } from "vitest";
import { virksomhetMock } from "@/mocks/ereg/virksomhetMock";
import { queryHookWrapper } from "./queryHookTestUtils";
import { VIRKSOMHET_PONTYPANDY } from "@/mocks/common/mockConstants";
import { testQueryClient } from "../testQueryClient";

let queryClient: QueryClient;

const orgnummer = VIRKSOMHET_PONTYPANDY.virksomhetsnummer;

interface Props {
  children: ReactNode;
}

describe("useVirksomheterQueries", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = testQueryClient();
  });

  function Wrapper({ children }: Props) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }

  it("omits hierarchy by default", async () => {
    const requestedUrls: string[] = [];
    mockServer.use(
      http.get(`*${EREG_ROOT}/organisasjon/100`, ({ request }) => {
        requestedUrls.push(request.url);
        return HttpResponse.json({
          type: "Virksomhet",
          organisasjonsnummer: "100",
          navn: { navnelinje1: "Virksomhet 100" },
        });
      }),
    );

    const { result } = renderHook(() => useVirksomheterQueries(["100"]), {
      wrapper: Wrapper,
    });

    await waitFor(() => expect(result.current.data).toHaveLength(1));
    expect(
      requestedUrls.map((url) =>
        new URL(url).searchParams.get("inkluderHierarki"),
      ),
    ).toEqual([null]);
  });

  it("deduplicates organisation requests within and across consumers", async () => {
    const legalEntityRequests = new Map<string, number>();
    mockServer.use(
      http.get(`*${EREG_ROOT}/organisasjon/:number`, async ({ params }) => {
        const number = String(params.number);
        legalEntityRequests.set(
          number,
          (legalEntityRequests.get(number) ?? 0) + 1,
        );
        if (number === "300") {
          await new Promise((resolve) => setTimeout(resolve, 30));
        }
        return HttpResponse.json({
          type: "JuridiskEnhet",
          organisasjonsnummer: number,
          navn: { navnelinje1: `Juridisk enhet ${number}` },
          juridiskEnhetDetaljer: { sektorkode: `S-${number}` },
        });
      }),
    );

    const firstConsumer = renderHook(
      () => useVirksomheterQueries(["300", "300", ""]),
      { wrapper: Wrapper },
    );
    const secondConsumer = renderHook(
      () => useVirksomheterQueries(["301", "300"]),
      { wrapper: Wrapper },
    );

    await waitFor(() => {
      expect(firstConsumer.result.current.data[0]?.organisasjonsnummer).toBe(
        "300",
      );
      expect(secondConsumer.result.current.data[0]?.organisasjonsnummer).toBe(
        "301",
      );
      expect(secondConsumer.result.current.data[1]?.organisasjonsnummer).toBe(
        "300",
      );
    });

    expect(legalEntityRequests.get("300")).toBe(1);
    expect(legalEntityRequests.get("301")).toBe(1);
    expect(firstConsumer.result.current.data).toHaveLength(1);
  });

  it("isolates cached base responses by hierarchy flag", async () => {
    const requestedUrls: string[] = [];
    mockServer.use(
      http.get(`*${EREG_ROOT}/organisasjon/100`, ({ request }) => {
        requestedUrls.push(request.url);
        const includeHierarchy = new URL(request.url).searchParams.get(
          "inkluderHierarki",
        );
        return HttpResponse.json({
          type: "Virksomhet",
          organisasjonsnummer: "100",
          navn: {
            navnelinje1: includeHierarchy
              ? "With hierarchy"
              : "Without hierarchy",
          },
          ...(includeHierarchy
            ? {
                inngaarIJuridiskEnheter: [{ organisasjonsnummer: "200" }],
              }
            : {}),
        });
      }),
    );

    const { result, rerender } = renderHook(
      ({ inkluderHierarki }: { inkluderHierarki: boolean }) =>
        useVirksomheterQueries(["100"], inkluderHierarki),
      {
        initialProps: { inkluderHierarki: false },
        wrapper: Wrapper,
      },
    );

    await waitFor(() =>
      expect(result.current.data[0]?.navn?.navnelinje1).toBe(
        "Without hierarchy",
      ),
    );
    rerender({ inkluderHierarki: true });

    await waitFor(() =>
      expect(result.current.data[0]?.navn?.navnelinje1).toBe("With hierarchy"),
    );
    expect(requestedUrls).toHaveLength(2);
    expect(
      requestedUrls.map((url) =>
        new URL(url).searchParams.get("inkluderHierarki"),
      ),
    ).toEqual([null, "true"]);
  });
});

describe("virksomhetQueryHooks tests", () => {
  beforeEach(() => {
    queryClient = testQueryClient();
    queryClient.setDefaultOptions({ queries: { retry: false } });
  });

  it("loads virksomhet for orgnummer", async () => {
    mockServer.use(
      http.get(`*${EREG_ROOT}/organisasjon/${orgnummer}`, () =>
        HttpResponse.json(virksomhetMock(orgnummer)),
      ),
    );

    const wrapper = queryHookWrapper(queryClient);

    const { result } = renderHook(() => useVirksomhetQuery(orgnummer), {
      wrapper,
    });

    await waitFor(() =>
      expect(result.current.data).toEqual(virksomhetMock(orgnummer)),
    );
    expect(result.current.virksomhetsnavn).toBe(
      VIRKSOMHET_PONTYPANDY.virksomhetsnavn,
    );
  });

  it("shares cache between multiple and single lookups", async () => {
    let requests = 0;
    const virksomhet: EregVirksomhetDTO = {
      type: "Virksomhet",
      organisasjonsnummer: orgnummer,
      navn: { navnelinje1: "Testvirksomhet" },
    };
    mockServer.use(
      http.get(`*${EREG_ROOT}/organisasjon/${orgnummer}`, () => {
        requests++;
        return HttpResponse.json(virksomhet);
      }),
    );
    const wrapper = queryHookWrapper(queryClient);

    const multiple = renderHook(() => useVirksomheterQueries([orgnummer]), {
      wrapper,
    });
    await waitFor(() => expect(multiple.result.current.data).toHaveLength(1));
    const single = renderHook(() => useVirksomhetQuery(orgnummer), { wrapper });

    expect(single.result.current.data).toEqual(virksomhet);
    expect(requests).toBe(1);
  });

  it("never sends personident to Ereg for single or hierarchy lookups", async () => {
    const requests: Request[] = [];
    mockServer.use(
      http.get(`*${EREG_ROOT}/organisasjon/${orgnummer}`, ({ request }) => {
        requests.push(request);
        return HttpResponse.json(virksomhetMock(orgnummer));
      }),
    );
    const wrapper = queryHookWrapper(queryClient);

    const { result } = renderHook(
      () => ({
        single: useVirksomhetQuery(orgnummer),
        hierarchy: useVirksomheterQueries([orgnummer], true),
      }),
      { wrapper },
    );
    await waitFor(() => expect(result.current.hierarchy.data).toHaveLength(1));
    await waitFor(() =>
      expect(result.current.single.data).toEqual(virksomhetMock(orgnummer)),
    );

    expect(requests).toHaveLength(2);
    expect(
      requests.every((request) => !request.headers.has("nav-personident")),
    ).toBe(true);
  });

  it("returns an empty name when Ereg omits name fields", async () => {
    queryClient.setQueryData(virksomhetQueryKeys.virksomhet(orgnummer), {
      type: "Virksomhet",
    });

    const { result } = renderHook(() => useVirksomhetQuery(orgnummer), {
      wrapper: queryHookWrapper(queryClient),
    });

    expect(result.current.virksomhetsnavn).toBe("");
  });

  it("returns successful data alongside an error from another lookup", async () => {
    const virksomhet: EregVirksomhetDTO = { type: "Virksomhet" };
    mockServer.use(
      http.get(`*${EREG_ROOT}/organisasjon/${orgnummer}`, () =>
        HttpResponse.json(virksomhet),
      ),
      http.get(
        `*${EREG_ROOT}/organisasjon/999888777`,
        () => new HttpResponse(null, { status: 500 }),
      ),
    );

    const { result } = renderHook(
      () => useVirksomheterQueries([orgnummer, "999888777"]),
      { wrapper: queryHookWrapper(queryClient) },
    );
    await waitFor(() => expect(result.current.isPending).toBe(false));

    expect(result.current.isError).toBe(true);
    expect(result.current.data).toEqual([virksomhet]);
  });

  it("returns an empty result without pending queries for an empty list", () => {
    const { result } = renderHook(() => useVirksomheterQueries([]), {
      wrapper: queryHookWrapper(queryClient),
    });

    expect(result.current).toEqual({
      data: [],
      isPending: false,
      isError: false,
    });
  });
});
