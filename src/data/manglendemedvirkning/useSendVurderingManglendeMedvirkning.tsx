import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ISMANGLENDEMEDVIRKNING_ROOT } from "@/apiConstants";
import { post } from "@/api/axios";
import {
  NewVurderingRequestDTO,
  VurderingResponseDTO,
} from "@/data/manglendemedvirkning/manglendeMedvirkningTypes";
import { manglendeMedvirkningQueryKeys } from "@/data/manglendemedvirkning/manglendeMedvirkningQueryHooks";

export function useSendVurderingManglendeMedvirkning() {
  const personident = useValgtPersonident();
  const queryClient = useQueryClient();
  const path = `${ISMANGLENDEMEDVIRKNING_ROOT}/manglende-medvirkning/vurderinger`;
  const postForhandsvarsel = (forhandsvarsel: NewVurderingRequestDTO) =>
    post<VurderingResponseDTO>(path, forhandsvarsel);

  return useMutation({
    mutationFn: postForhandsvarsel,
    onSuccess: (data: VurderingResponseDTO) => {
      queryClient.setQueryData(
        manglendeMedvirkningQueryKeys.manglendeMedvirkning(personident),
        (oldData: VurderingResponseDTO[]) => [data, ...oldData]
      );
    },
  });
}
