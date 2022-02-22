import { useQuery } from "react-query";
import { get } from "@/api/axios";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { ISOPPFOLGINGSTILFELLE_ROOT } from "@/apiConstants";
import { OppfolgingstilfellePersonDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import { minutesToMillis } from "@/utils/timeUtils";

const oppfolgingstilfellePersonQueryKeys = {
  oppfolgingstilfelleperson: (personIdent: string) => [
    "oppfolgingstilfelleperson",
    personIdent,
  ],
};

export const useOppfolgingstilfellePersonQuery = () => {
  const personIdent = useValgtPersonident();
  const path = `${ISOPPFOLGINGSTILFELLE_ROOT}/oppfolgingstilfelle/personident`;
  const fetchOppfolgingstilfellePerson = () =>
    get<OppfolgingstilfellePersonDTO>(path, personIdent);
  return useQuery(
    oppfolgingstilfellePersonQueryKeys.oppfolgingstilfelleperson(personIdent),
    fetchOppfolgingstilfellePerson,
    {
      enabled: !!personIdent,
      staleTime: minutesToMillis(60 * 12),
    }
  );
};

export const useStartOfLatestOppfolgingstilfelle = (): Date | undefined => {
  const {
    data: oppfolgingstilfellePerson,
  } = useOppfolgingstilfellePersonQuery();
  return oppfolgingstilfellePerson?.oppfolgingstilfelleList[0]?.start;
};
