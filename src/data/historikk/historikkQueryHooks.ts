import { SYFOOPPFOLGINGSPLANSERVICE_V3_ROOT } from "@/apiConstants";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import {
  HistorikkEvent,
  HistorikkEventType,
} from "@/data/historikk/types/historikkTypes";
import { get } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import { minutesToMillis } from "@/utils/utils";

export const historikkQueryKeys = {
  oppfolgingsplan: (fnr: string) => ["historikk", "oppfolgingsplan", fnr],
};

export const useHistorikkOppfolgingsplan = () => {
  const fnr = useValgtPersonident();
  const path = `${SYFOOPPFOLGINGSPLANSERVICE_V3_ROOT}/oppfolgingsplan/historikk`;
  const fetchHistorikkOppfolgingsplan = () => get<HistorikkEvent[]>(path, fnr);
  const query = useQuery({
    queryKey: historikkQueryKeys.oppfolgingsplan(fnr),
    queryFn: fetchHistorikkOppfolgingsplan,
    enabled: !!fnr,
    staleTime: minutesToMillis(60 * 12),
  });

  return {
    data: mapHistorikkEvents(query.data || [], "OPPFOLGINGSPLAN"),
    isLoading: query.isLoading,
    isError: query.isError,
  };
};

export const mapHistorikkEvents = (
  events: HistorikkEvent[],
  kilde: HistorikkEventType
): HistorikkEvent[] =>
  events.map((event) => ({
    ...event,
    kilde,
  }));
