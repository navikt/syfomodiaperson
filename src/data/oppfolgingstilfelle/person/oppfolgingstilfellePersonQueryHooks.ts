import { useQuery } from "@tanstack/react-query";
import { get } from "@/api/axios";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { ISOPPFOLGINGSTILFELLE_ROOT } from "@/apiConstants";
import {
  hasGjentakendeSykefravar,
  isInactive,
  OppfolgingstilfelleDTO,
  OppfolgingstilfellePersonDTO,
} from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import { minutesToMillis } from "@/utils/utils";
import { sortByDescendingStart } from "@/utils/oppfolgingstilfelleUtils";

export const oppfolgingstilfellePersonQueryKeys = {
  oppfolgingstilfelleperson: (personIdent: string) => [
    "oppfolgingstilfelleperson",
    personIdent,
  ],
};

type OppfolgingstilfellePersonQuery = {
  isLoading: boolean;
  isError: boolean;
  latestOppfolgingstilfelle: OppfolgingstilfelleDTO | undefined;
  tilfellerDescendingStart: OppfolgingstilfelleDTO[];
  hasOppfolgingstilfelle: boolean;
  hasActiveOppfolgingstilfelle: boolean;
  hasGjentakendeSykefravar: boolean;
};

export function useOppfolgingstilfellePersonQuery(): OppfolgingstilfellePersonQuery {
  const personIdent = useValgtPersonident();
  const path = `${ISOPPFOLGINGSTILFELLE_ROOT}/oppfolgingstilfelle/personident`;
  const fetchOppfolgingstilfellePerson = () =>
    get<OppfolgingstilfellePersonDTO>(path, personIdent);
  const query = useQuery({
    queryKey:
      oppfolgingstilfellePersonQueryKeys.oppfolgingstilfelleperson(personIdent),
    queryFn: fetchOppfolgingstilfellePerson,
    enabled: !!personIdent,
    staleTime: minutesToMillis(60 * 12),
  });

  const tilfellerDescendingStart = query.data
    ? sortByDescendingStart(query.data.oppfolgingstilfelleList)
    : [];

  const latestOppfolgingstilfelle: OppfolgingstilfelleDTO | undefined =
    tilfellerDescendingStart && tilfellerDescendingStart[0];

  const gjentakende = query.data && hasGjentakendeSykefravar(query.data);

  return {
    isLoading: query.isLoading,
    isError: query.isError,
    latestOppfolgingstilfelle,
    tilfellerDescendingStart,
    hasOppfolgingstilfelle: !!latestOppfolgingstilfelle,
    hasActiveOppfolgingstilfelle:
      !!latestOppfolgingstilfelle && !isInactive(latestOppfolgingstilfelle),
    hasGjentakendeSykefravar: !!gjentakende,
  };
}

export function useStartOfLatestOppfolgingstilfelle(): Date | undefined {
  const { latestOppfolgingstilfelle } = useOppfolgingstilfellePersonQuery();
  return latestOppfolgingstilfelle?.start;
}

export function useEndOfLatestOppfolgingstilfelle(): Date | undefined {
  const { latestOppfolgingstilfelle } = useOppfolgingstilfellePersonQuery();
  return latestOppfolgingstilfelle?.end;
}

export function useVirksomhetsnummerOfLatestOppfolgingstilfelle():
  | string
  | undefined {
  const { latestOppfolgingstilfelle } = useOppfolgingstilfellePersonQuery();
  return latestOppfolgingstilfelle?.virksomhetsnummerList.at(0);
}

export function useCurrentVarighetOppfolgingstilfelle(): number | undefined {
  const { latestOppfolgingstilfelle } = useOppfolgingstilfellePersonQuery();
  return latestOppfolgingstilfelle?.varighetUker;
}
