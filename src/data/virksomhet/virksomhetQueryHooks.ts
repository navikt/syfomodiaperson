import { EREG_ROOT } from "@/apiConstants";
import { get } from "@/api/axios";
import {
  EregOrganisasjonResponseDTO,
  getVirksomhetsnavn,
} from "@/data/virksomhet/types/EregOrganisasjonResponseDTO";
import { useQueries, useQuery } from "@tanstack/react-query";
import { minutesToMillis } from "@/utils/utils";

export const virksomhetQueryKeys = {
  virksomhet: (virksomhetsnummer?: string) => ["virksomhet", virksomhetsnummer],
};

const path = (virksomhetsnummer?: string) =>
  `${EREG_ROOT}/organisasjon/${virksomhetsnummer}`;
const fetchVirksomhet = (path: string) =>
  get<EregOrganisasjonResponseDTO>(path);

export interface VirksomhetQueryData {
  virksomhetsnummer: string;
  virksomhetsnavn?: string;
  data?: EregOrganisasjonResponseDTO;
}

export type VirksomhetQueryDataRecord = Record<string, VirksomhetQueryData>;

export function useVirksomhetQuery(virksomhetsnummer: string | undefined) {
  const query = useQuery({
    queryKey: virksomhetQueryKeys.virksomhet(virksomhetsnummer),
    queryFn: () => fetchVirksomhet(path(virksomhetsnummer)),
    enabled: !!virksomhetsnummer,
    staleTime: minutesToMillis(60 * 12),
  });

  return {
    data: query.data,
    virksomhetsnavn: query.data && getVirksomhetsnavn(query.data),
  };
}

export function useVirksomheterQueries(virksomhetsnummer: string[] = []): {
  data: VirksomhetQueryDataRecord;
} {
  const results = useQueries({
    queries: virksomhetsnummer.map((nummer) => ({
      queryKey: virksomhetQueryKeys.virksomhet(nummer),
      queryFn: () => fetchVirksomhet(path(nummer)),
      enabled: !!nummer,
      staleTime: minutesToMillis(60 * 12),
    })),
  });

  return {
    data: results.reduce<VirksomhetQueryDataRecord>((acc, result, index) => {
      const nummer = virksomhetsnummer[index];

      if (!nummer) {
        return acc;
      }

      return {
        ...acc,
        [nummer]: {
          virksomhetsnummer: nummer,
          virksomhetsnavn: result.data && getVirksomhetsnavn(result.data),
          data: result.data,
        },
      };
    }, {}),
  };
}
