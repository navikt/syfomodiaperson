import { ISDIALOGMOTE_ROOT, ISDIALOGMOTEKANDIDAT_ROOT } from "@/apiConstants";
import { post } from "@/api/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateIkkeAktuellDTO } from "@/data/dialogmotekandidat/types/dialogmoteikkeaktuellTypes";
import { dialogmotekandidatQueryKeys } from "@/data/dialogmotekandidat/dialogmotekandidatQueryHooks";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { dialogmoteIkkeAktuellQueryKeys } from "@/sider/dialogmoter/hooks/useGetDialogmoteIkkeAktuell";

export const useSettDialogmoteIkkeAktuell = () => {
  const queryClient = useQueryClient();
  const personident = useValgtPersonident();

  const setIkkeAktuellPath = `${ISDIALOGMOTEKANDIDAT_ROOT}/ikkeaktuell/personident`;
  const lukkAvventPath = `${ISDIALOGMOTE_ROOT}/avvent/lukk`;

  return useMutation({
    mutationFn: async (newIkkeAktuellDTO: CreateIkkeAktuellDTO) => {
      await post(setIkkeAktuellPath, newIkkeAktuellDTO);
      await post(lukkAvventPath, { personident });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: dialogmotekandidatQueryKeys.kandidat(personident),
      });
      queryClient.invalidateQueries({
        queryKey:
          dialogmoteIkkeAktuellQueryKeys.ikkeAktuellVurdering(personident),
      });
      queryClient.invalidateQueries({
        queryKey: dialogmotekandidatQueryKeys.avvent(personident),
      });
    },
  });
};
