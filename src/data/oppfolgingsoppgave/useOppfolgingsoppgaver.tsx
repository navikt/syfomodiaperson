import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { ISHUSKELAPP_ROOT } from "@/apiConstants";
import { get } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import { OppfolgingsoppgaveResponseDTO } from "@/data/oppfolgingsoppgave/types";

export const oppfolgingsoppgaverQueryKeys = {
  oppfolgingsoppgaver: (personident: string) => [
    "oppfolgingsoppgaver",
    personident,
  ],
};

export const useOppfolgingsoppgaver = () => {
  const personident = useValgtPersonident();
  const path = `${ISHUSKELAPP_ROOT}/huskelapp?filter=all`;
  const getOppfolgingsoppgaver = () =>
    get<OppfolgingsoppgaveResponseDTO[]>(path, personident);

  const {
    data: oppfolgingsoppgaver,
    isLoading,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: oppfolgingsoppgaverQueryKeys.oppfolgingsoppgaver(personident),
    queryFn: getOppfolgingsoppgaver,
    enabled: !!personident,
  });

  return {
    oppfolgingsoppgaver: oppfolgingsoppgaver,
    isSuccess,
    isLoading,
    isError,
  };
};
