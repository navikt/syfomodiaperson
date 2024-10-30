import { useLedereQuery } from "@/data/leder/ledereQueryHooks";
import { useMemo } from "react";
import { NarmesteLederRelasjonDTO } from "@/data/leder/ledereTypes";
import { HistorikkEvent } from "@/data/historikk/types/historikkTypes";

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

interface LedereHistorikk {
  isLedereHistorikkLoading: boolean;
  isLedereHistorikkError: boolean;
  lederHistorikk: HistorikkEvent[];
}

export function useLedereHistorikk(): LedereHistorikk {
  const {
    isLoading: isLedereLoading,
    isError: isLedereError,
    currentLedere,
    formerLedere,
  } = useLedereQuery();

  const allLedere = useMemo(
    () => [...currentLedere, ...formerLedere],
    [currentLedere, formerLedere]
  );

  const lederHistorikk = createHistorikkEventsFromLedere(allLedere);

  return {
    isLedereHistorikkLoading: isLedereLoading,
    isLedereHistorikkError: isLedereError,
    lederHistorikk,
  };
}
