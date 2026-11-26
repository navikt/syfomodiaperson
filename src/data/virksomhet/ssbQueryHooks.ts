import {
  NaringskodeHierarki,
  NaringskodeStandard,
} from "@/data/virksomhet/Naringskode";
import { get } from "@/api/axios";
import { SYFOPERSON_ROOT } from "@/apiConstants";
import { minutesToMillis } from "@/utils/utils";
import { useQueries, useQuery } from "@tanstack/react-query";

export const bransjeQueryKeys = {
  bransje: (naringskode: string, standard: NaringskodeStandard) => [
    "bransje",
    naringskode,
    standard,
  ],
};

function fetchNaringskode(naringskode: string, standard: NaringskodeStandard) {
  return get<NaringskodeHierarki>(
    `${SYFOPERSON_ROOT}/naringskode/${naringskode}?standard=${standard}`,
  );
}

export function useNaringskodeQuery(
  naringskode: string,
  standard: NaringskodeStandard,
) {
  return useQuery({
    queryKey: bransjeQueryKeys.bransje(naringskode, standard),
    queryFn: () => fetchNaringskode(naringskode, standard),
    staleTime: minutesToMillis(60 * 12),
    enabled: !!naringskode,
  });
}

export function useNaringskodeQueries(
  codes: { naringskode: string; standard: NaringskodeStandard }[],
) {
  const queries = codes.map((code) => {
    return {
      queryKey: bransjeQueryKeys.bransje(code.naringskode, code.standard),
      queryFn: () => fetchNaringskode(code.naringskode, code.standard),
      staleTime: minutesToMillis(60 * 12),
    };
  });

  return useQueries({
    queries: queries,
    combine: (queries) => {
      return {
        data: queries
          .map((query) => query.data)
          .filter((data) => data !== undefined),
        isPending: queries.some((query) => query.isPending),
        isError: queries.some((query) => query.isError),
      };
    },
  });
}
