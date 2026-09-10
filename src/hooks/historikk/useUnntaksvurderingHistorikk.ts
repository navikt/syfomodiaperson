import { useGetUnntaksvurderingerQuery } from "@/sider/oppfolgingsplan/hooks/unntaksvurderingerQueryHook";
import { HistorikkEvents } from "./useHistorikk";
import { Unntaksvurdering } from "@/sider/oppfolgingsplan/hooks/types/Unntaksvurdering";
import { HistorikkEvent } from "@/data/historikk/types/historikkTypes";

function createEventsFromUnntaksvurderinger(
  unntaksvurderinger: Unntaksvurdering[],
): HistorikkEvent[] {
  const events: HistorikkEvent[] = [];

  unntaksvurderinger.forEach((unntaksvurdering) => {
    events.push({
      tekst: `${unntaksvurdering.organisasjonsnavn} har vurdert unntak for oppfølgingsplan.`,
      tidspunkt: new Date(unntaksvurdering.meldtTidspunkt),
      kilde: "UNNTAKSVURDERING",
    });
  });

  return events;
}

export function useUnntaksvurderingHistorikk(): HistorikkEvents {
  const {
    data: unntaksvurderinger,
    isLoading,
    isError,
  } = useGetUnntaksvurderingerQuery();

  const events = createEventsFromUnntaksvurderinger(unntaksvurderinger ?? []);

  return {
    isLoading,
    isError,
    events: events,
  };
}
