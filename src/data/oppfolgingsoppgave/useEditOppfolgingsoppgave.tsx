import { useValgtPersonident } from "@/hooks/useValgtBruker";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query/build/modern";
import { ISHUSKELAPP_ROOT } from "@/apiConstants";
import { EditOppfolgingsoppgaveRequestDTO } from "@/data/oppfolgingsoppgave/types";
import { post } from "@/api/axios";
import { oppfolgingsoppgaveQueryKeys } from "@/data/oppfolgingsoppgave/useGetOppfolgingsoppgave";

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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: oppfolgingsoppgaveQueryKeys.oppfolgingsoppgave(personident),
      });
    },
  });
}
