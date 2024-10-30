import { HistorikkEvent } from "@/data/historikk/types/historikkTypes";
import { useVedtakQuery } from "@/data/frisktilarbeid/vedtakQuery";
import { VedtakResponseDTO } from "@/data/frisktilarbeid/frisktilarbeidTypes";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";

function friskTilArbeidText(vedtak: VedtakResponseDTO): string {
  const fom = tilLesbarDatoMedArUtenManedNavn(vedtak.fom);
  const tom = tilLesbarDatoMedArUtenManedNavn(vedtak.tom);
  return `${vedtak.veilederident} fattet vedtak. Periode: ${fom} - ${tom}`;
}

function createHistorikkEventsFromFriskTilArbeid(
  vedtakList: VedtakResponseDTO[]
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

interface VedtakHistorikk {
  isVedtakHistorikkLoading: boolean;
  isVedtakHistorikkError: boolean;
  vedtakHistorikk: HistorikkEvent[];
}

export function useVedtakHistorikk(): VedtakHistorikk {
  const {
    data: vedtak,
    isLoading: isVedtakLoading,
    isError: isVedtakError,
  } = useVedtakQuery();

  const frisktilarbeidHistorikk =
    createHistorikkEventsFromFriskTilArbeid(vedtak);

  return {
    isVedtakHistorikkLoading: isVedtakLoading,
    isVedtakHistorikkError: isVedtakError,
    vedtakHistorikk: frisktilarbeidHistorikk,
  };
}
