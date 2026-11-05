import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { ISPERSONOPPGAVE_ROOT } from "@/apiConstants";
import { get } from "@/api/axios";
import {
  PersonOppgave,
  PersonOppgaveDTO,
} from "@/data/personoppgave/types/PersonOppgave";
import { useQuery } from "@tanstack/react-query";
import { minutesToMillis } from "@/utils/utils";

export const personoppgaverQueryKeys = {
  personoppgaver: (fnr: string) => ["personoppgaver", fnr],
};

export function usePersonoppgaverQuery() {
  const fnr = useValgtPersonident();
  const path = `${ISPERSONOPPGAVE_ROOT}/personoppgave/personident`;
  const fetchPersonoppgaver = () => get<PersonOppgaveDTO[]>(path, fnr);
  return useQuery({
    queryKey: personoppgaverQueryKeys.personoppgaver(fnr),
    queryFn: fetchPersonoppgaver,
    enabled: !!fnr,
    staleTime: minutesToMillis(60 * 12),
    select: (data) => parseOppgaver(data),
  });
}

export const parseOppgaver = (
  oppgaver: PersonOppgaveDTO[],
): PersonOppgave[] => {
  return oppgaver.map((oppgave) => ({
    ...oppgave,
    opprettet: new Date(oppgave.opprettet),
    behandletTidspunkt: oppgave.behandletTidspunkt
      ? new Date(oppgave.behandletTidspunkt)
      : null,
  }));
};
