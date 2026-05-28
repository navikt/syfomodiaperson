import { HistorikkEvent } from "@/data/historikk/types/historikkTypes";
import { useHistorikkOppfolgingsplan } from "@/data/historikk/historikkQueryHooks";
import { OppfolgingsplanLPS } from "@/sider/oppfolgingsplan/hooks/types/OppfolgingsplanLPS";
import { HistorikkEvents } from "@/hooks/historikk/useHistorikk";
import {
  OppfolgingsplanForesporselResponse,
  useGetOppfolgingsplanForesporselQuery,
} from "@/sider/oppfolgingsplan/hooks/oppfolgingsplanForesporselHooks";
import { OppfolgingsplanV2DTO } from "@/sider/oppfolgingsplan/hooks/types/OppfolgingsplanV2DTO";
import { useOppfolgingsplaner } from "@/sider/oppfolgingsplan/hooks/useOppfolgingsplaner";

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
    lpsPlaner: oppfolgingsplanerLPS,
    allePlanerV2: oppfolgingsplanerV2,
    isLoading: isOppfolgingsplanerLoading,
    isError: isOppfolgingsplanerError,
  } = useOppfolgingsplaner();
  const {
    data: oppfolgingsplanForesporsler,
    isLoading: isOppfolgingsplanForesporslerLoading,
    isError: isOppfolgingsplanForesporslerError,
  } = useGetOppfolgingsplanForesporselQuery();

  const oppfolgingsplanHistorikkEvents = oppfolgingsplanHistorikk
    .concat(lpsplanerToHistorikkEvents(oppfolgingsplanerLPS))
    .concat(foresporslerToHistorikkEvents(oppfolgingsplanForesporsler || []))
    .concat(oppfolgingsplanerV2ToHistorikkEvents(oppfolgingsplanerV2));

  return {
    isLoading:
      isOppfolgingsplanLoading ||
      isOppfolgingsplanerLoading ||
      isOppfolgingsplanForesporslerLoading,
    isError:
      isOppfolgingsplanError ||
      isOppfolgingsplanerError ||
      isOppfolgingsplanForesporslerError,
    events: oppfolgingsplanHistorikkEvents,
  };
}
