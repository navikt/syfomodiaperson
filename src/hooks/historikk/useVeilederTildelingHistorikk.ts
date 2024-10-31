import { HistorikkEvent } from "@/data/historikk/types/historikkTypes";
import {
  useVeilederTildelingHistorikkData,
  VeilederTildelingHistorikkDTO,
} from "@/data/veilederbrukerknytning/useGetVeilederBrukerKnytning";
import { useBrukerinfoQuery } from "@/data/navbruker/navbrukerQueryHooks";

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
  if (value.tildeltAv == "X000000") {
    return `${value.tildeltVeileder} på enhet ${value.tildeltEnhet} ble satt som veileder`;
  } else {
    return `${value.tildeltAv} satt ${value.tildeltVeileder} på enhet ${value.tildeltEnhet} som veileder`;
  }
}

interface VeilederTildelingHistorikk {
  isLoading: boolean;
  isError: boolean;
  events: HistorikkEvent[];
}

export function useVeilederTildelingHistorikk(): VeilederTildelingHistorikk {
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
