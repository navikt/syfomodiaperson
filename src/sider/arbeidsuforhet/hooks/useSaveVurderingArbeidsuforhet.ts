import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ISARBEIDSUFORHET_ROOT } from "@/apiConstants";
import { post } from "@/api/axios";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import {
  VurderingRequestDTO,
  VurderingResponseDTO,
} from "@/sider/arbeidsuforhet/data/arbeidsuforhetTypes";
import { arbeidsuforhetQueryKeys } from "@/sider/arbeidsuforhet/hooks/arbeidsuforhetQueryHooks";

export const useSaveVurderingArbeidsuforhet = () => {
  const personident = useValgtPersonident();
  const queryClient = useQueryClient();
  const path = `${ISARBEIDSUFORHET_ROOT}/arbeidsuforhet/vurderinger`;
  const postVurdering = (vurdering: VurderingRequestDTO) =>
    post<VurderingResponseDTO>(path, vurdering, personident);

  return useMutation({
    mutationFn: postVurdering,
    onSuccess: (data: VurderingResponseDTO) => {
      queryClient.setQueryData(
        arbeidsuforhetQueryKeys.arbeidsuforhet(personident),
        (oldData: VurderingResponseDTO[]) => [data, ...oldData]
      );
    },
  });
};
