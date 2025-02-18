import { useLedereQuery } from "@/data/leder/ledereQueryHooks";
import { useMemo } from "react";
import { NarmesteLederRelasjonDTO } from "@/data/leder/ledereTypes";
import { HistorikkEvent } from "@/data/historikk/types/historikkTypes";
import { HistorikkHook } from "@/hooks/historikk/useHistorikk";

function createHistorikkEventsFromLedere(
  ledere: NarmesteLederRelasjonDTO[]
): HistorikkEvent[] {
  return ledere.map((leder) => ({
    opprettetAv: leder.virksomhetsnavn,
    tekst: `${leder.virksomhetsnavn} har oppgitt ${leder.narmesteLederNavn} som nærmeste leder`,
    tidspunkt: leder.aktivFom,
    kilde: "LEDER",
  }));
}

export function useLedereHistorikk(): HistorikkHook {
  const { isLoading, isError, currentLedere, formerLedere } = useLedereQuery();

  const allLedere = useMemo(
    () => [...currentLedere, ...formerLedere],
    [currentLedere, formerLedere]
  );

  const lederHistorikk = createHistorikkEventsFromLedere(allLedere);

  return {
    isLoading,
    isError,
    events: lederHistorikk,
  };
}
