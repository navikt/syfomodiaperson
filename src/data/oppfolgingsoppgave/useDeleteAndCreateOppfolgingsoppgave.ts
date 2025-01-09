import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteOppfolgingsoppgave } from "@/data/oppfolgingsoppgave/useRemoveOppfolgingsoppgave";
import { postOppfolgingsoppgave } from "@/data/oppfolgingsoppgave/useCreateOppfolgingsoppgave";
import { OppfolgingsoppgaveRequestDTO } from "@/data/oppfolgingsoppgave/types";
import { aktivOppfolgingsoppgaveQueryKeys } from "@/data/oppfolgingsoppgave/useAktivOppfolgingsoppgave";
import { oppfolgingsoppgaverQueryKeys } from "@/data/oppfolgingsoppgave/useOppfolgingsoppgaver";

export const useDeleteAndCreateOppfolgingsoppgave = () => {
  const personident = useValgtPersonident();
  const queryClient = useQueryClient();
  const deleteAndCreateOppfolgingsoppgave = async (payload: {
    existingOppfolgingsoppgaveUuid: string;
    nyOppfolgingsoppgave: OppfolgingsoppgaveRequestDTO;
  }) => {
    const { existingOppfolgingsoppgaveUuid, nyOppfolgingsoppgave } = payload;
    await deleteOppfolgingsoppgave(personident, existingOppfolgingsoppgaveUuid);
    await postOppfolgingsoppgave(personident, nyOppfolgingsoppgave);
  };

  return useMutation({
    mutationFn: deleteAndCreateOppfolgingsoppgave,
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
