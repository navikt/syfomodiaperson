import { ISDIALOGMOTEKANDIDAT_ROOT } from "@/apiConstants";
import { post } from "@/api/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateUnntakDTO } from "@/data/dialogmotekandidat/types/dialogmoteunntakTypes";
import { dialogmotekandidatQueryKeys } from "@/data/dialogmotekandidat/dialogmotekandidatQueryHooks";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { dialogmoteunntakQueryKeys } from "@/data/dialogmotekandidat/useGetDialogmoteunntakQuery";

export const useSettDialogmoteunntak = () => {
  const queryClient = useQueryClient();
  const personident = useValgtPersonident();

  const path = `${ISDIALOGMOTEKANDIDAT_ROOT}/unntak/personident`;
  const postSettDialogmoteunntak = (newUnntakDTO: CreateUnntakDTO) =>
    post(path, newUnntakDTO);

  return useMutation({
    mutationFn: postSettDialogmoteunntak,
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: dialogmotekandidatQueryKeys.kandidat(personident),
      });
      queryClient.invalidateQueries({
        queryKey: dialogmoteunntakQueryKeys.unntak(personident),
      });
      queryClient.invalidateQueries({
        queryKey: dialogmotekandidatQueryKeys.avvent(personident),
      });
    },
  });
};
