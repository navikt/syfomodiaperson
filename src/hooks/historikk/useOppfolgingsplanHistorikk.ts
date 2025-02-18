import { HistorikkEvent } from "@/data/historikk/types/historikkTypes";
import { useHistorikkOppfolgingsplan } from "@/data/historikk/historikkQueryHooks";
import { useOppfolgingsplanerLPSQuery } from "@/data/oppfolgingsplan/oppfolgingsplanQueryHooks";
import { OppfolgingsplanLPS } from "@/data/oppfolgingsplan/types/OppfolgingsplanLPS";
import { HistorikkHook } from "@/hooks/historikk/useHistorikk";
import {
  OppfolgingsplanForesporselResponse,
  useGetOppfolgingsplanForesporselQuery,
} from "@/data/oppfolgingsplan/oppfolgingsplanForesporselHooks";

function lpsplanerToHistorikkEvents(
  oppfolgingsplanerLPS: OppfolgingsplanLPS[]
): HistorikkEvent[] {
  return oppfolgingsplanerLPS.map(({ opprettet, virksomhetsnummer }) => ({
    kilde: "OPPFOLGINGSPLAN_LPS",
    tekst: `Oppfølgingsplanen ble delt med Nav av ${virksomhetsnummer}.`,
    tidspunkt: new Date(opprettet),
  }));
}

function foresporslerToHistorikkEvents(
  oppfolgingsplanForesporsler: OppfolgingsplanForesporselResponse[]
): HistorikkEvent[] {
  return oppfolgingsplanForesporsler.map(
    ({ createdAt, virksomhetsnummer, veilederident }) => ({
      kilde: "OPPFOLGINGSPLAN_FORESPORSEL",
      tekst: `${veilederident} ba om oppfølgingsplan fra ${virksomhetsnummer}.`,
      tidspunkt: new Date(createdAt),
    })
  );
}

export function useOppfolgingsplanHistorikk(): HistorikkHook {
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
  const {
    data: oppfolgingsplanForesporsler,
    isLoading: isOppfolgingsplanForesporslerLoading,
    isError: isOppfolgingsplanForesporslerError,
  } = useGetOppfolgingsplanForesporselQuery();

  const oppfolgingsplanHistorikkEvents = oppfolgingsplanHistorikk
    .concat(lpsplanerToHistorikkEvents(oppfolgingsplanerLPS))
    .concat(foresporslerToHistorikkEvents(oppfolgingsplanForesporsler || []));

  return {
    isLoading:
      isOppfolgingsplanLoading ||
      isOppfolgingsplanerLPSLoading ||
      isOppfolgingsplanForesporslerLoading,
    isError:
      isOppfolgingsplanError ||
      isOppfolgingsplanerLPSError ||
      isOppfolgingsplanForesporslerError,
    events: oppfolgingsplanHistorikkEvents,
  };
}
