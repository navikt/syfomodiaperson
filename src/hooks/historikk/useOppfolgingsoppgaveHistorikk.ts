import { HistorikkEvent } from "@/data/historikk/types/historikkTypes";
import {
  oppfolgingsgrunnToText,
  OppfolgingsoppgaveNewResponseDTO,
} from "@/data/oppfolgingsoppgave/types";
import { useGetOppfolgingsoppgaver } from "@/data/oppfolgingsoppgave/useGetOppfolgingsoppgaver";

interface OppfolgingsoppgaveHistorikk {
  isLoading: boolean;
  isError: boolean;
  events: HistorikkEvent[];
}

function createHistorikkEvents(
  oppfolgingsoppgaver: OppfolgingsoppgaveNewResponseDTO[]
): HistorikkEvent[] {
  const historikkEvents: HistorikkEvent[] = [];

  oppfolgingsoppgaver.map(({ isActive, removedBy, updatedAt, versjoner }) => {
    const oppfolgingsgrunn = versjoner[0]?.oppfolgingsgrunn;
    const oppfolgingsgrunnText =
      oppfolgingsgrunn && oppfolgingsgrunnToText[oppfolgingsgrunn];

    versjoner.forEach(({ createdAt, createdBy, tekst }, index) => {
      if (index == 0) {
        const opprettetOppfolgingsoppgave: HistorikkEvent = {
          opprettetAv: createdBy,
          tekst: `${createdBy} opprettet oppfølgingsoppgave (${oppfolgingsgrunnText})`,
          tidspunkt: createdAt,
          kilde: "OPPFOLGINGSOPPGAVE",
          expandable: {
            isExpandable: true,
            content: tekst ?? "",
          },
        };
        historikkEvents.push(opprettetOppfolgingsoppgave);
      } else {
        const endretOppfolgingsoppgave: HistorikkEvent = {
          opprettetAv: createdBy,
          tekst: `${createdBy} endret oppfølgingsoppgave (${oppfolgingsgrunnText})`,
          tidspunkt: createdAt,
          kilde: "OPPFOLGINGSOPPGAVE",
          expandable: {
            isExpandable: true,
            content: tekst ?? "",
          },
        };
        historikkEvents.push(endretOppfolgingsoppgave);
      }
    });

    if (!isActive) {
      const fjernetOppfolgingsoppgave: HistorikkEvent = {
        opprettetAv: removedBy ?? "",
        tekst: `${removedBy} fjernet oppfølgingsoppgaven (${oppfolgingsgrunnText})`,
        tidspunkt: updatedAt,
        kilde: "OPPFOLGINGSOPPGAVE",
      };
      historikkEvents.push(fjernetOppfolgingsoppgave);
    }
  });

  return historikkEvents;
}

export function useOppfolgingsoppgaveHistorikk(): OppfolgingsoppgaveHistorikk {
  const {
    oppfolgingsoppgaver: oppfolgingsoppgaver,
    isLoading: isOppfolgingsoppgaverLoading,
    isError: isOppfolgingsoppgaverError,
  } = useGetOppfolgingsoppgaver();

  const historikkEvents = createHistorikkEvents(oppfolgingsoppgaver || []);

  return {
    isLoading: isOppfolgingsoppgaverLoading,
    isError: isOppfolgingsoppgaverError,
    events: historikkEvents,
  };
}
