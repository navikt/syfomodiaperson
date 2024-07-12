import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ISMEROPPFOLGING_ROOT } from "@/apiConstants";
import { post } from "@/api/axios";
import {
  SenOppfolgingKandidatResponseDTO,
  SenOppfolgingVurderingRequestDTO,
} from "@/data/senoppfolging/senOppfolgingTypes";
import { senOppfolgingKandidatQueryKeys } from "@/data/senoppfolging/useSenOppfolgingKandidatQuery";

export const useVurderSenOppfolgingKandidat = (kandidatUuid: string) => {
  const personident = useValgtPersonident();
  const queryClient = useQueryClient();
  const path = `${ISMEROPPFOLGING_ROOT}/senoppfolging/kandidater/${kandidatUuid}/vurderinger`;
  const postVurdering = (vurdering: SenOppfolgingVurderingRequestDTO) =>
    post<SenOppfolgingKandidatResponseDTO>(path, vurdering, personident);

  return useMutation({
    mutationFn: postVurdering,
    onSuccess: (data: SenOppfolgingKandidatResponseDTO) => {
      queryClient.setQueryData(
        senOppfolgingKandidatQueryKeys.senOppfolgingKandidat(personident),
        (oldData: SenOppfolgingKandidatResponseDTO[]) => [
          data,
          ...oldData.slice(1),
        ]
      );
    },
  });
};
