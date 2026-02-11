import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { ISHUSKELAPP_ROOT } from "@/apiConstants";
import { post } from "@/api/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { oppfolgingsoppgaverQueryKeys } from "@/data/oppfolgingsoppgave/useOppfolgingsoppgaver";
import { aktivOppfolgingsoppgaveQueryKeys } from "@/data/oppfolgingsoppgave/useAktivOppfolgingsoppgave";
import { OppfolgingsoppgaveRequestDTO } from "@/data/oppfolgingsoppgave/types";
import { UseMutationResult } from "@tanstack/react-query/build/modern/types";
import { ApiErrorException } from "@/api/errors";

export const useCreateOppfolgingsoppgave = (): UseMutationResult<
  OppfolgingsoppgaveRequestDTO,
  ApiErrorException,
  OppfolgingsoppgaveRequestDTO
> => {
  const personident = useValgtPersonident();
  const queryClient = useQueryClient();
  const path = `${ISHUSKELAPP_ROOT}/huskelapp`;
  const postOppfolgingsoppgave = (
    nyOppfolgingsoppgave: OppfolgingsoppgaveRequestDTO
  ) =>
    post<OppfolgingsoppgaveRequestDTO>(path, nyOppfolgingsoppgave, personident);

  return useMutation({
    mutationFn: postOppfolgingsoppgave,
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
