import { HistorikkEvent } from "@/data/historikk/types/historikkTypes";
import { useHistorikkOppfolgingsplan } from "@/data/historikk/historikkQueryHooks";
import {
  useGetLPSOppfolgingsplanerQuery,
  useGetOppfolgingsplanerV2Query,
} from "@/sider/oppfolgingsplan/hooks/oppfolgingsplanQueryHooks";
import { OppfolgingsplanLPS } from "@/sider/oppfolgingsplan/hooks/types/OppfolgingsplanLPS";
import { HistorikkEvents } from "@/hooks/historikk/useHistorikk";
import {
  OppfolgingsplanForesporselResponse,
  useGetOppfolgingsplanForesporselQuery,
} from "@/sider/oppfolgingsplan/hooks/oppfolgingsplanForesporselHooks";
import { OppfolgingsplanV2DTO } from "@/sider/oppfolgingsplan/hooks/types/OppfolgingsplanV2DTO";

function lpsplanerToHistorikkEvents(
  oppfolgingsplanerLPS: OppfolgingsplanLPS[]
): HistorikkEvent[] {
  return oppfolgingsplanerLPS.map(({ opprettet, virksomhetsnummer }) => ({
    kilde: "OPPFOLGINGSPLAN_LPS",
    tekst: `Oppfølgingsplanen ble delt med Nav av ${virksomhetsnummer}.`,
    tidspunkt: new Date(opprettet),
  }));
}

function oppfolgingsplanerV2ToHistorikkEvents(
  oppfolgingsplanerV2: OppfolgingsplanV2DTO[]
): HistorikkEvent[] {
  return oppfolgingsplanerV2.map(
    ({ deltMedNavTidspunkt, virksomhetsnummer }) => ({
      kilde: "OPPFOLGINGSPLAN",
      tekst: `Oppfølgingsplanen ble delt med Nav av ${virksomhetsnummer}.`,
      tidspunkt: new Date(deltMedNavTidspunkt),
    })
  );
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

export function useOppfolgingsplanHistorikk(): HistorikkEvents {
  const {
    data: oppfolgingsplanHistorikk,
    isLoading: isOppfolgingsplanLoading,
    isError: isOppfolgingsplanError,
  } = useHistorikkOppfolgingsplan();
  const {
    data: oppfolgingsplanerLPS,
    isLoading: isOppfolgingsplanerLPSLoading,
    isError: isOppfolgingsplanerLPSError,
  } = useGetLPSOppfolgingsplanerQuery();
  const {
    data: oppfolgingsplanForesporsler,
    isLoading: isOppfolgingsplanForesporslerLoading,
    isError: isOppfolgingsplanForesporslerError,
  } = useGetOppfolgingsplanForesporselQuery();
  const {
    data: oppfolgingsplanerV2,
    isLoading: isOppfolgingsplanerV2Loading,
    isError: isOppfolgingsplanerV2Error,
  } = useGetOppfolgingsplanerV2Query();

  const oppfolgingsplanHistorikkEvents = oppfolgingsplanHistorikk
    .concat(lpsplanerToHistorikkEvents(oppfolgingsplanerLPS))
    .concat(foresporslerToHistorikkEvents(oppfolgingsplanForesporsler || []))
    .concat(oppfolgingsplanerV2ToHistorikkEvents(oppfolgingsplanerV2));

  return {
    isLoading:
      isOppfolgingsplanLoading ||
      isOppfolgingsplanerLPSLoading ||
      isOppfolgingsplanForesporslerLoading ||
      isOppfolgingsplanerV2Loading,
    isError:
      isOppfolgingsplanError ||
      isOppfolgingsplanerLPSError ||
      isOppfolgingsplanForesporslerError ||
      isOppfolgingsplanerV2Error,
    events: oppfolgingsplanHistorikkEvents,
  };
}
