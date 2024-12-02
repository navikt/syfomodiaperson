import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { ISHUSKELAPP_ROOT } from "@/apiConstants";
import { EditOppfolgingsoppgaveRequestDTO } from "@/data/oppfolgingsoppgave/types";
import { post } from "@/api/axios";
import { oppfolgingsoppgaverQueryKeys } from "@/data/oppfolgingsoppgave/useOppfolgingsoppgaver";
import { aktivOppfolgingsoppgaveQueryKeys } from "@/data/oppfolgingsoppgave/useAktivOppfolgingsoppgave";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useEditOppfolgingsoppgave(
  existingOppfolgingsoppgaveUuid?: string
) {
  const personident = useValgtPersonident();
  const queryClient = useQueryClient();
  const path = `${ISHUSKELAPP_ROOT}/huskelapp/${existingOppfolgingsoppgaveUuid}`;
  const editOppfolgingsoppgave = (
    editedOppfolgingsoppgave: EditOppfolgingsoppgaveRequestDTO
  ) =>
    post<EditOppfolgingsoppgaveRequestDTO>(
      path,
      editedOppfolgingsoppgave,
      personident
    );

  return useMutation({
    mutationFn: editOppfolgingsoppgave,
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({
          queryKey:
            aktivOppfolgingsoppgaveQueryKeys.aktivOppfolgingsoppgave(
              personident
            ),
        }),
        queryClient.invalidateQueries({
          queryKey:
            oppfolgingsoppgaverQueryKeys.oppfolgingsoppgaver(personident),
        }),
      ]),
  });
}
