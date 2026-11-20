import { HistorikkEvent } from "@/data/historikk/types/historikkTypes";
import { usePersonoppgaverQuery } from "@/data/personoppgave/personoppgaveQueryHooks";
import { PersonOppgaveType } from "@/data/personoppgave/types/PersonOppgave";
import { HistorikkEvents } from "@/hooks/historikk/useHistorikk";

export function useBistandsbehovHistorikk(): HistorikkEvents {
  const { data: oppgaver, isLoading, isError } = usePersonoppgaverQuery();

  const events = (oppgaver ?? [])
    .filter(
      (oppgave) => oppgave.type === PersonOppgaveType.BEHANDLER_BER_OM_BISTAND,
    )
    .reduce<HistorikkEvent[]>((acc, oppgave) => {
      const bistandBehandletEvent: HistorikkEvent | null =
        oppgave.behandletTidspunkt && oppgave.behandletVeilederIdent
          ? {
              tekst: `Bistandsbehov vurdert av ${oppgave.behandletVeilederIdent}`,
              tidspunkt: oppgave.behandletTidspunkt,
              opprettetAv: oppgave.behandletVeilederIdent,
              kilde: "BISTANDSBEHOV",
            }
          : null;

      return bistandBehandletEvent ? [...acc, bistandBehandletEvent] : acc;
    }, []);

  return { events, isLoading, isError };
}
