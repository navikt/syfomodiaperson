import { SYFOBEHANDLENDEENHET_ROOT } from "@/apiConstants";
import { useQuery } from "@tanstack/react-query";
import { get } from "@/api/axios";
import { useBehandlendeEnhetQuery } from "@/data/behandlendeenhet/behandlendeEnhetQueryHooks";

export const muligeOppfolgingsenhetQueryKeys = {
  muligeOppfolgingsenheter: (enhetId?: string) => [
    "muligeOppfolgingsenheter",
    enhetId,
  ],
};

export function useGetMuligeOppfolgingsenheter() {
  const { data: behandlendeenhet } = useBehandlendeEnhetQuery();
  const enhetId = behandlendeenhet?.geografiskEnhet?.enhetId;
  const path = `${SYFOBEHANDLENDEENHET_ROOT}/tilordningsenheter/${enhetId}`;
  const getVeilederBrukerKnytning = () => get<Enhet[]>(path);

  return useQuery({
    queryKey: muligeOppfolgingsenhetQueryKeys.muligeOppfolgingsenheter(enhetId),
    queryFn: getVeilederBrukerKnytning,
    enabled: !!enhetId,
  });
}

export interface Enhet {
  enhetId: string;
  navn: string;
}
