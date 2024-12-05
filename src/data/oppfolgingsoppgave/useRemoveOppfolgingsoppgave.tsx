import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { ISHUSKELAPP_ROOT } from "@/apiConstants";
import { deleteRequest } from "@/api/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { oppfolgingsoppgaverQueryKeys } from "@/data/oppfolgingsoppgave/useOppfolgingsoppgaver";
import { aktivOppfolgingsoppgaveQueryKeys } from "@/data/oppfolgingsoppgave/useAktivOppfolgingsoppgave";

export const useRemoveOppfolgingsoppgave = () => {
  const personident = useValgtPersonident();
  const queryClient = useQueryClient();
  const deleteOppfolgingsoppgave = (oppfolgingsoppgaveUuid: string) => {
    const path = `${ISHUSKELAPP_ROOT}/huskelapp/${oppfolgingsoppgaveUuid}`;
    return deleteRequest(path, personident);
  };

  return useMutation({
    mutationFn: deleteOppfolgingsoppgave,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          aktivOppfolgingsoppgaveQueryKeys.aktivOppfolgingsoppgave(personident),
      });
      queryClient.invalidateQueries({
        queryKey: oppfolgingsoppgaverQueryKeys.oppfolgingsoppgaver(personident),
      });
    },
  });
};
