import { SYFOBEHANDLENDEENHET_ROOT } from "@/apiConstants";
import { get } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { minutesToMillis } from "@/utils/utils";
import { BehandlendeEnhetResponseDTO } from "@/data/behandlendeenhet/types/BehandlendeEnhetDTOs";
import { TildeltHistorikkResponseDTO } from "@/hooks/historikk/useTildeltOppfolgingsenhetHistorikk";

const behandlendeenhetGlobalCacheKeyPrefix = "behandlendeenhet";
export const behandlendeenhetGlobalCacheKey = (fnr: string) => [
  behandlendeenhetGlobalCacheKeyPrefix,
  fnr,
];
export const behandlendeEnhetQueryKeys = {
  behandlendeEnhet: (fnr: string) => [
    behandlendeenhetGlobalCacheKeyPrefix,
    fnr,
  ],
  historikk: (fnr: string) => [
    behandlendeenhetGlobalCacheKeyPrefix,
    fnr,
    "historikk",
  ],
};

export const useBehandlendeEnhetQuery = () => {
  const fnr = useValgtPersonident();
  const path = `${SYFOBEHANDLENDEENHET_ROOT}/personident`;
  const fetchBehandlendeEnhet = () =>
    get<BehandlendeEnhetResponseDTO>(path, fnr);
  return useQuery({
    queryKey: behandlendeEnhetQueryKeys.behandlendeEnhet(fnr),
    queryFn: fetchBehandlendeEnhet,
    enabled: !!fnr,
    staleTime: minutesToMillis(60 * 12),
  });
};

export const useTildeltOppfolgingsenhetHistorikkQuery = () => {
  const fnr = useValgtPersonident();
  const path = `${SYFOBEHANDLENDEENHET_ROOT}/historikk`;
  const fetchTildelHistorikkHistorikk = () =>
    get<TildeltHistorikkResponseDTO>(path, fnr);

  return useQuery({
    queryKey: behandlendeEnhetQueryKeys.historikk(fnr),
    queryFn: fetchTildelHistorikkHistorikk,
    enabled: !!fnr,
  });
};
