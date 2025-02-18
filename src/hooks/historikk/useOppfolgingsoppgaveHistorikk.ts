import { HistorikkEvent } from "@/data/historikk/types/historikkTypes";
import {
  oppfolgingsgrunnToText,
  OppfolgingsoppgaveResponseDTO,
} from "@/data/oppfolgingsoppgave/types";
import { useOppfolgingsoppgaver } from "@/data/oppfolgingsoppgave/useOppfolgingsoppgaver";
import { HistorikkHook } from "@/hooks/historikk/useHistorikk";

function createHistorikkEvents(
  oppfolgingsoppgaver: OppfolgingsoppgaveResponseDTO[]
): HistorikkEvent[] {
  const historikkEvents: HistorikkEvent[] = [];

  oppfolgingsoppgaver.map(({ isActive, removedBy, updatedAt, versjoner }) => {
    const oppfolgingsgrunn = versjoner[0]?.oppfolgingsgrunn;
    const oppfolgingsgrunnText =
      oppfolgingsgrunn && oppfolgingsgrunnToText[oppfolgingsgrunn];

    versjoner.forEach(({ createdAt, createdBy, tekst }, index) => {
      if (index == versjoner.length - 1) {
        const opprettetOppfolgingsoppgave: HistorikkEvent = {
          opprettetAv: createdBy,
          tekst: `${createdBy} opprettet oppfølgingsoppgave (${oppfolgingsgrunnText})`,
          tidspunkt: createdAt,
          kilde: "OPPFOLGINGSOPPGAVE",
          expandableContent: tekst ?? "",
        };
        historikkEvents.push(opprettetOppfolgingsoppgave);
      } else {
        const endretOppfolgingsoppgave: HistorikkEvent = {
          opprettetAv: createdBy,
          tekst: `${createdBy} endret oppfølgingsoppgave (${oppfolgingsgrunnText})`,
          tidspunkt: createdAt,
          kilde: "OPPFOLGINGSOPPGAVE",
          expandableContent: tekst ?? "",
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

export function useOppfolgingsoppgaveHistorikk(): HistorikkHook {
  const {
    oppfolgingsoppgaver: oppfolgingsoppgaver,
    isLoading,
    isError,
  } = useOppfolgingsoppgaver();

  const historikkEvents = createHistorikkEvents(oppfolgingsoppgaver || []);

  return {
    isLoading,
    isError,
    events: historikkEvents,
  };
}
