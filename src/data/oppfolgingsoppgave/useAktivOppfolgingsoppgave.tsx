import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { ISHUSKELAPP_ROOT } from "@/apiConstants";
import { get } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import { OppfolgingsoppgaveResponseDTO } from "@/data/oppfolgingsoppgave/types";

export const aktivOppfolgingsoppgaveQueryKeys = {
  aktivOppfolgingsoppgave: (personident: string) => [
    "aktivOppfolgingsoppgave",
    personident,
  ],
};

export const useAktivOppfolgingsoppgave = () => {
  const personident = useValgtPersonident();
  const path = `${ISHUSKELAPP_ROOT}/huskelapp?isActive=true`;
  const getOppfolgingsoppgave = () =>
    get<OppfolgingsoppgaveResponseDTO>(path, personident);

  const {
    data: aktivOppfolgingsoppgave,
    isLoading,
    isError,
    isSuccess,
  } = useQuery({
    queryKey:
      aktivOppfolgingsoppgaveQueryKeys.aktivOppfolgingsoppgave(personident),
    queryFn: getOppfolgingsoppgave,
    enabled: !!personident,
  });

  return {
    aktivOppfolgingsoppgave: aktivOppfolgingsoppgave,
    isSuccess,
    isLoading,
    isError,
  };
};
