import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { ISPERSONOPPGAVE_ROOT } from "@/apiConstants";
import { get } from "@/api/axios";
import { PersonOppgave } from "@/data/personoppgave/types/PersonOppgave";
import { useQuery } from "@tanstack/react-query";
import { minutesToMillis } from "@/utils/utils";

export const personoppgaverQueryKeys = {
  personoppgaver: (fnr: string) => ["personoppgaver", fnr],
};

export const usePersonoppgaverQuery = () => {
  const fnr = useValgtPersonident();
  const path = `${ISPERSONOPPGAVE_ROOT}/personoppgave/personident`;
  const fetchPersonoppgaver = () => get<PersonOppgave[]>(path, fnr);
  const query = useQuery({
    queryKey: personoppgaverQueryKeys.personoppgaver(fnr),
    queryFn: fetchPersonoppgaver,
    enabled: !!fnr,
    staleTime: minutesToMillis(60 * 12),
  });

  return {
    data: query.data || [],
  };
};
