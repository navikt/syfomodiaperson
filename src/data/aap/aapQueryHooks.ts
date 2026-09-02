import { useQuery } from "@tanstack/react-query";
import { post } from "@/api/axios";
import { SYFOPERSON_ROOT } from "@/apiConstants";
import { AapSakerRequestDTO, AapStatusDTO } from "@/data/aap/aapTypes";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { minutesToMillis } from "@/utils/utils";

export const aapQueryKeys = {
  aapStatus(personident: string) {
    return ["aapStatus", personident];
  },
};

export function useAapStatusQuery() {
  const personident = useValgtPersonident();
  const path = `${SYFOPERSON_ROOT}/person/aap-saker/query`;
  const requestDTO: AapSakerRequestDTO = { personident };

  function fetchAapStatus() {
    return post<AapStatusDTO>(path, requestDTO);
  }

  return useQuery({
    queryKey: aapQueryKeys.aapStatus(personident),
    queryFn: fetchAapStatus,
    enabled: !!personident,
    staleTime: minutesToMillis(60 * 12),
  });
}
