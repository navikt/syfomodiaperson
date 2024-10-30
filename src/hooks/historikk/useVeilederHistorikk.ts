import { HistorikkEvent } from "@/data/historikk/types/historikkTypes";
import {
  useVeilederHistorikk,
  VeilederHistorikkDTO,
} from "@/data/veilederbrukerknytning/useGetVeilederBrukerKnytning";
import { BrukerinfoDTO } from "@/data/navbruker/types/BrukerinfoDTO";
import { useBrukerinfoQuery } from "@/data/navbruker/navbrukerQueryHooks";

function createHistorikkEventsFromVeilederHistorikk(
  veilederHistorikkDTO: VeilederHistorikkDTO,
  person: BrukerinfoDTO
): HistorikkEvent[] {
  return veilederHistorikkDTO.map((value) => ({
    opprettetAv: value.tildeltAv,
    tekst: `${value.tildeltAv} satt ${value.tildeltVeileder} i ${value.tildeltEnhet} som veileder`,
    tidspunkt: value.tildeltDato,
    kilde: "VEILEDER",
  }));
}

interface VeilederHistorikk {
  isVeilederHistorikkLoading: boolean;
  isVeilederHistorikkError: boolean;
  veilederHistorikk: HistorikkEvent[];
}

export function useVeilederBrukerHistorikk(): VeilederHistorikk {
  const { brukerinfo: person } = useBrukerinfoQuery();
  const {
    data: veilederHistorikk,
    isLoading: isVeilederHistorikkLoading,
    isError: isVeilederHistorikkError,
  } = useVeilederHistorikk();

  const veilederHistorikkEvents = createHistorikkEventsFromVeilederHistorikk(
    veilederHistorikk || [],
    person
  );

  return {
    isVeilederHistorikkLoading,
    isVeilederHistorikkError,
    veilederHistorikk: veilederHistorikkEvents,
  };
}
