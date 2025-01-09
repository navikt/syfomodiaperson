import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { ISHUSKELAPP_ROOT } from "@/apiConstants";
import { post } from "@/api/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { oppfolgingsoppgaverQueryKeys } from "@/data/oppfolgingsoppgave/useOppfolgingsoppgaver";
import { aktivOppfolgingsoppgaveQueryKeys } from "@/data/oppfolgingsoppgave/useAktivOppfolgingsoppgave";
import { OppfolgingsoppgaveRequestDTO } from "@/data/oppfolgingsoppgave/types";

export const postOppfolgingsoppgave = (
  personident: string,
  nyOppfolgingsoppgave: OppfolgingsoppgaveRequestDTO
) =>
  post<OppfolgingsoppgaveRequestDTO>(
    `${ISHUSKELAPP_ROOT}/huskelapp`,
    nyOppfolgingsoppgave,
    personident
  );

export const useCreateOppfolgingsoppgave = () => {
  const personident = useValgtPersonident();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (nyOppfolgingsoppgave: OppfolgingsoppgaveRequestDTO) =>
      postOppfolgingsoppgave(personident, nyOppfolgingsoppgave),
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
