import { SYFOBEHANDLENDEENHET_ROOT } from "@/apiConstants";
import { useQuery } from "@tanstack/react-query";
import { get } from "@/api/axios";
import { useBehandlendeEnhetQuery } from "@/data/behandlendeenhet/behandlendeEnhetQueryHooks";
import { useValgtPersonident } from "@/hooks/useValgtBruker";

export const muligeOppfolgingsenhetQueryKeys = {
  muligeOppfolgingsenheter: (enhetId?: string, personident?: string) => [
    "muligeOppfolgingsenheter",
    enhetId,
    personident,
  ],
};

export function useGetMuligeOppfolgingsenheter() {
  const { data: behandlendeenhet } = useBehandlendeEnhetQuery();
  const personident = useValgtPersonident();
  const enhetId =
    behandlendeenhet?.oppfolgingsenhetDTO?.enhet.enhetId ??
    behandlendeenhet?.geografiskEnhet?.enhetId;
  const path = `${SYFOBEHANDLENDEENHET_ROOT}/tilordningsenheter/${enhetId}`;
  const fetchMuligeOppfolgingsenheter = () => get<Enhet[]>(path, personident);

  return useQuery({
    queryKey: muligeOppfolgingsenhetQueryKeys.muligeOppfolgingsenheter(
      enhetId,
      personident
    ),
    queryFn: fetchMuligeOppfolgingsenheter,
    enabled: !!personident && !!enhetId,
  });
}

export interface Enhet {
  enhetId: string;
  navn: string;
}
