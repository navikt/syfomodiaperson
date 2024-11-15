import { HistorikkEvent } from "@/data/historikk/types/historikkTypes";
import { useHistorikkOppfolgingsplan } from "@/data/historikk/historikkQueryHooks";
import { useOppfolgingsplanerLPSQuery } from "@/data/oppfolgingsplan/oppfolgingsplanQueryHooks";
import { OppfolgingsplanLPS } from "@/data/oppfolgingsplan/types/OppfolgingsplanLPS";

interface OppfolgingsplanHistorikk {
  isLoading: boolean;
  isError: boolean;
  events: HistorikkEvent[];
}

function toHistorikkEvents(
  oppfolgingsplanerLPS: OppfolgingsplanLPS[]
): HistorikkEvent[] {
  return oppfolgingsplanerLPS.map(({ opprettet, virksomhetsnummer }) => ({
    kilde: "OPPFOLGINGSPLAN_LPS",
    tekst: `Oppfølgingsplanen ble delt med NAV av ${virksomhetsnummer}.`,
    tidspunkt: new Date(opprettet),
  }));
}

export function useOppfolgingsplanHistorikk(): OppfolgingsplanHistorikk {
  const {
    data: oppfolgingsplanHistorikk,
    isLoading: isOppfolgingsplanLoading,
    isError: isOppfolgingsplanError,
  } = useHistorikkOppfolgingsplan();
  const {
    data: oppfolgingsplanerLPS,
    isLoading: isOppfolgingsplanerLPSLoading,
    isError: isOppfolgingsplanerLPSError,
  } = useOppfolgingsplanerLPSQuery();

  const oppfolgingsplanHistorikkEvents = oppfolgingsplanHistorikk.concat(
    toHistorikkEvents(oppfolgingsplanerLPS)
  );

  return {
    isLoading: isOppfolgingsplanLoading || isOppfolgingsplanerLPSLoading,
    isError: isOppfolgingsplanError || isOppfolgingsplanerLPSError,
    events: oppfolgingsplanHistorikkEvents,
  };
}
