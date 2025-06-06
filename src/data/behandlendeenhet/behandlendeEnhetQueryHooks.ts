import { SYFOBEHANDLENDEENHET_ROOT } from "@/apiConstants";
import { get, post } from "@/api/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { minutesToMillis } from "@/utils/utils";
import {
  BehandlendeEnhetResponseDTO,
  TildelOppfolgingsenhetRequestDTO,
  TildelOppfolgingsenhetResponseDTO,
} from "@/data/behandlendeenhet/types/BehandlendeEnhetDTOs";
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

export const useChangeEnhet = (fnr: string) => {
  const queryClient = useQueryClient();
  const path = `${SYFOBEHANDLENDEENHET_ROOT}/oppfolgingsenhet-tildelinger`;
  const postChangeEnhet = (requestDTO: TildelOppfolgingsenhetRequestDTO) =>
    post<TildelOppfolgingsenhetResponseDTO>(path, requestDTO);
  const behandlendeEnhetQueryKey =
    behandlendeEnhetQueryKeys.behandlendeEnhet(fnr);

  return useMutation({
    mutationFn: postChangeEnhet,
    onSuccess: (data: TildelOppfolgingsenhetResponseDTO) => {
      queryClient.setQueryData(behandlendeEnhetQueryKey, data);
      return queryClient.invalidateQueries({
        queryKey: behandlendeenhetGlobalCacheKey(fnr),
      });
    },
  });
};
