import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ISAKTIVITETSKRAV_ROOT } from "@/apiConstants";
import { NewVurderingDTO } from "@/data/aktivitetskrav/aktivitetskravTypes";
import { post } from "@/api/axios";
import { aktivitetskravQueryKeys } from "@/data/aktivitetskrav/aktivitetskravQueryHooks";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { pengestoppStatusQueryKeys } from "@/data/pengestopp/pengestoppQueryHooks";

export const useVurderAktivitetskrav = (aktivitetskravUuid: string) => {
  const personident = useValgtPersonident();
  const queryClient = useQueryClient();
  const path = `${ISAKTIVITETSKRAV_ROOT}/aktivitetskrav/${aktivitetskravUuid}/vurder`;
  const postVurderAktivitetskrav = (vurdering: NewVurderingDTO) =>
    post(path, vurdering, personident);

  return useMutation({
    mutationFn: postVurderAktivitetskrav,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: aktivitetskravQueryKeys.aktivitetskrav(personident),
      });
      queryClient.invalidateQueries({
        queryKey: pengestoppStatusQueryKeys.pengestoppStatus(personident),
      });
    },
  });
};
