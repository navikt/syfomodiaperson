import { HistorikkEvent } from "@/data/historikk/types/historikkTypes";
import {
  useVeilederTildelingHistorikkData,
  VeilederTildelingHistorikkDTO,
} from "@/data/veilederbrukerknytning/useGetVeilederBrukerKnytning";
import { HistorikkHook } from "@/hooks/historikk/useHistorikk";

function createHistorikkEventsFromVeilederTildelingHistorikk(
  veilederTildelingHistorikkDTO: VeilederTildelingHistorikkDTO[]
): HistorikkEvent[] {
  return veilederTildelingHistorikkDTO.map((value) => ({
    opprettetAv: value.tildeltAv,
    tekst: getHistorikkTekst(value),
    tidspunkt: value.tildeltDato,
    kilde: "VEILEDER_TILDELING",
  }));
}

function getHistorikkTekst(value: VeilederTildelingHistorikkDTO): string {
  if (
    value.tildeltAv == "X000000" ||
    value.tildeltAv == value.tildeltVeileder
  ) {
    return `${value.tildeltVeileder} på enhet ${value.tildeltEnhet} ble satt som veileder`;
  } else {
    return `${value.tildeltAv} satt ${value.tildeltVeileder} på enhet ${value.tildeltEnhet} som veileder`;
  }
}

export function useVeilederTildelingHistorikk(): HistorikkHook {
  const {
    data: events,
    isLoading,
    isError,
  } = useVeilederTildelingHistorikkData();

  const veilederTildelingHistorikkEvents =
    createHistorikkEventsFromVeilederTildelingHistorikk(events || []);

  return {
    isLoading,
    isError,
    events: veilederTildelingHistorikkEvents,
  };
}
