import { SYFOBEHANDLENDEENHET_ROOT } from "@/apiConstants";
import { post } from "@/api/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { behandlendeEnhetQueryKeys } from "@/data/behandlendeenhet/behandlendeEnhetQueryHooks";
import {
  TildelOppfolgingsenhetRequestDTO,
  TildelOppfolgingsenhetResponseDTO,
} from "@/data/behandlendeenhet/types/BehandlendeEnhetDTOs";

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
      return queryClient
        .invalidateQueries({
          queryKey: behandlendeEnhetQueryKey,
        })
        .then(() => {
          return queryClient.invalidateQueries({
            queryKey: behandlendeEnhetQueryKeys.historikk(fnr),
          });
        });
    },
  });
};
