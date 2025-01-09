import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { ISHUSKELAPP_ROOT } from "@/apiConstants";
import { deleteRequest } from "@/api/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { oppfolgingsoppgaverQueryKeys } from "@/data/oppfolgingsoppgave/useOppfolgingsoppgaver";
import { aktivOppfolgingsoppgaveQueryKeys } from "@/data/oppfolgingsoppgave/useAktivOppfolgingsoppgave";

export const deleteOppfolgingsoppgave = (
  personident: string,
  oppfolgingsoppgaveUuid: string
) =>
  deleteRequest(
    `${ISHUSKELAPP_ROOT}/huskelapp/${oppfolgingsoppgaveUuid}`,
    personident
  );

export const useRemoveOppfolgingsoppgave = () => {
  const personident = useValgtPersonident();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (oppfolgingsoppgaveUuid: string) =>
      deleteOppfolgingsoppgave(personident, oppfolgingsoppgaveUuid),
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
