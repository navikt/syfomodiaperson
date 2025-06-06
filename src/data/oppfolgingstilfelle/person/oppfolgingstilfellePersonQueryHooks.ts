import { useQuery } from "@tanstack/react-query";
import { get } from "@/api/axios";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { ISOPPFOLGINGSTILFELLE_ROOT } from "@/apiConstants";
import {
  OppfolgingstilfelleDTO,
  OppfolgingstilfellePersonDTO,
} from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import { minutesToMillis } from "@/utils/utils";
import dayjs from "dayjs";
import {
  isGjentakendeSykefravar,
  sortByDescendingStart,
} from "@/utils/oppfolgingstilfelleUtils";

export const ARBEIDSGIVERPERIODE_DAYS = 16;
export const THREE_YEARS_AGO_IN_MONTHS = 36;
export const MIN_DAYS_IN_LONG_TILFELLE = 3;

const isInactive = (oppfolgingstilfelle: OppfolgingstilfelleDTO) => {
  const today = dayjs(new Date());
  const tilfelleEnd = dayjs(oppfolgingstilfelle.end);

  return today.isAfter(
    tilfelleEnd.add(ARBEIDSGIVERPERIODE_DAYS, "days"),
    "date"
  );
};

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

export const useOppfolgingstilfellePersonQuery =
  (): OppfolgingstilfellePersonQuery => {
    const personIdent = useValgtPersonident();
    const path = `${ISOPPFOLGINGSTILFELLE_ROOT}/oppfolgingstilfelle/personident`;
    const fetchOppfolgingstilfellePerson = () =>
      get<OppfolgingstilfellePersonDTO>(path, personIdent);
    const query = useQuery({
      queryKey:
        oppfolgingstilfellePersonQueryKeys.oppfolgingstilfelleperson(
          personIdent
        ),
      queryFn: fetchOppfolgingstilfellePerson,
      enabled: !!personIdent,
      staleTime: minutesToMillis(60 * 12),
    });

    const tilfellerDescendingStart = query.data
      ? sortByDescendingStart(query.data.oppfolgingstilfelleList)
      : [];

    const latestOppfolgingstilfelle: OppfolgingstilfelleDTO | undefined =
      tilfellerDescendingStart && tilfellerDescendingStart[0];

    const gjentakende =
      query.data && isGjentakendeSykefravar(query.data.oppfolgingstilfelleList);

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
  };

export const useStartOfLatestOppfolgingstilfelle = (): Date | undefined => {
  const { latestOppfolgingstilfelle } = useOppfolgingstilfellePersonQuery();
  return latestOppfolgingstilfelle?.start;
};

export const useEndOfLatestOppfolgingstilfelle = (): Date | undefined => {
  const { latestOppfolgingstilfelle } = useOppfolgingstilfellePersonQuery();
  return latestOppfolgingstilfelle?.end;
};

export const useVirksomhetsnummerOfLatestOppfolgingstilfelle = ():
  | string
  | undefined => {
  const { latestOppfolgingstilfelle } = useOppfolgingstilfellePersonQuery();
  return latestOppfolgingstilfelle?.virksomhetsnummerList.at(0);
};

export const useCurrentVarighetOppfolgingstilfelle = (): number | undefined => {
  const { latestOppfolgingstilfelle } = useOppfolgingstilfellePersonQuery();
  return latestOppfolgingstilfelle?.varighetUker;
};
