import { EREG_ROOT } from "@/apiConstants";
import { get } from "@/api/axios";
import {
  EregOrganisasjonResponseDTO,
  getVirksomhetsnavn,
} from "@/data/virksomhet/types/EregOrganisasjonResponseDTO";
import { useQuery } from "@tanstack/react-query";
import { minutesToMillis } from "@/utils/utils";

export const virksomhetQueryKeys = {
  virksomhet: (virksomhetsnummer?: string) => ["virksomhet", virksomhetsnummer],
};

const path = (virksomhetsnummer?: string) =>
  `${EREG_ROOT}/organisasjon/${virksomhetsnummer}`;
const fetchVirksomhet = (path: string) =>
  get<EregOrganisasjonResponseDTO>(path);

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
