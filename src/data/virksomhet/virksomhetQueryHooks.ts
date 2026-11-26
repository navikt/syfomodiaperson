import { EREG_ROOT } from "@/apiConstants";
import { get } from "@/api/axios";
import {
  EregOrganisasjonResponseDTO,
  getVirksomhetsnavn,
} from "@/data/virksomhet/types/EregOrganisasjonResponseDTO";
import { useQueries, useQuery } from "@tanstack/react-query";
import { minutesToMillis } from "@/utils/utils";

/** Stable Ereg query keys, including whether the response contains hierarchy data. */
export const virksomhetQueryKeys = {
  virksomhet: (virksomhetsnummer?: string, inkluderHierarki = false) => [
    "virksomhet",
    virksomhetsnummer,
    inkluderHierarki,
  ],
};

function fetchVirksomhet(virksomhetsnummer: string, inkluderHierarki: boolean) {
  const hierarchyQuery = inkluderHierarki ? "?inkluderHierarki=true" : "";
  return get<EregOrganisasjonResponseDTO>(
    `${EREG_ROOT}/organisasjon/${virksomhetsnummer}${hierarchyQuery}`,
  );
}

/** Fetches an organisation without hierarchy and preserves the existing result contract. */
export function useVirksomhetQuery(virksomhetsnummer: string | undefined) {
  const query = useQuery({
    queryKey: virksomhetQueryKeys.virksomhet(virksomhetsnummer),
    queryFn: () => fetchVirksomhet(virksomhetsnummer ?? "", false),
    enabled: !!virksomhetsnummer,
    staleTime: minutesToMillis(60 * 12),
  });

  return {
    data: query.data,
    virksomhetsnavn: query.data && getVirksomhetsnavn(query.data),
  };
}

/**
 * Fetches several organisations while sharing raw query keys and cache entries with single lookups.
 */
export function useVirksomheterQueries(
  virksomhetnumre: string[],
  inkluderHierarki = false,
) {
  const virksomhetsnummerList = Array.from(new Set(virksomhetnumre)).filter(
    (nummer) => nummer !== undefined && nummer !== null && nummer !== "",
  );

  return useQueries({
    queries: virksomhetsnummerList.map((nummer) => ({
      queryKey: virksomhetQueryKeys.virksomhet(nummer, inkluderHierarki),
      queryFn: () => fetchVirksomhet(nummer, inkluderHierarki),
      enabled: !!nummer,
      staleTime: minutesToMillis(60 * 12),
    })),
    combine: (queries) => ({
      data: queries
        .map((query) => query.data)
        .filter((data) => data !== undefined),
      isPending: queries.some((query) => query.isPending),
      isError: queries.some((query) => query.isError),
    }),
  });
}
