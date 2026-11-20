import { HistorikkEvent } from "@/data/historikk/types/historikkTypes";
import { useVedtakQuery } from "@/data/frisktilarbeid/vedtakQuery";
import { VedtakResponseDTO } from "@/data/frisktilarbeid/frisktilarbeidTypes";
import { formatNumericDate } from "@/utils/datoUtils";
import { HistorikkEvents } from "@/hooks/historikk/useHistorikk";

function friskTilArbeidText(vedtak: VedtakResponseDTO): string {
  const fom = formatNumericDate(vedtak.fom);
  const tom = formatNumericDate(vedtak.tom);
  return `${vedtak.veilederident} fattet vedtak. Periode: ${fom} - ${tom}`;
}

function createHistorikkEventsFromFriskTilArbeid(
  vedtakList: VedtakResponseDTO[],
): HistorikkEvent[] {
  return vedtakList.map((vedtak: VedtakResponseDTO) => {
    return {
      opprettetAv: vedtak.veilederident,
      tekst: friskTilArbeidText(vedtak),
      tidspunkt: vedtak.createdAt,
      kilde: "FRISKMELDING_TIL_ARBEIDSFORMIDLING",
    };
  });
}

export function useVedtakHistorikk(): HistorikkEvents {
  const { data: vedtak, isPending, isError } = useVedtakQuery();

  const frisktilarbeidHistorikk =
    createHistorikkEventsFromFriskTilArbeid(vedtak);

  return {
    isLoading: isPending,
    isError,
    events: frisktilarbeidHistorikk,
  };
}
