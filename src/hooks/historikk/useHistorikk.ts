import { HistorikkEvent } from "../../data/historikk/types/historikkTypes";
import {
  useHistorikkMotebehovQuery,
  useHistorikkOppfolgingsplan,
} from "@/data/historikk/historikkQueryHooks";
import { useLedereHistorikk } from "@/hooks/historikk/useLedereHistorikk";
import { useAktivitetskravHistorikk } from "@/hooks/historikk/useAktivitetskravHistorikk";
import { useArbeidsuforhetHistorikk } from "@/hooks/historikk/useArbeidsuforhetHistorikk";
import { useManglendeMedvirkningHistorikk } from "@/hooks/historikk/useManglendeMedvirkningHistorikk";
import { useVedtakHistorikk } from "@/hooks/historikk/useFriskmeldingTilArbeidsformidligVedtakHistorikk";
import { useVeilederBrukerHistorikk } from "@/hooks/historikk/useVeilederHistorikk";
import { useDialogmotekandidatHistorikk } from "@/hooks/historikk/useDialogmotekandidatHistorikk";

interface HistorikkHook {
  isHistorikkLoading: boolean;
  isHistorikkError: boolean;
  historikkEvents: HistorikkEvent[];
}

export function useHistorikk(): HistorikkHook {
  const {
    data: motebehovHistorikk,
    isLoading: isMotebehovLoading,
    isError: isMotebehovError,
  } = useHistorikkMotebehovQuery();

  const {
    data: oppfolgingsplanHistorikk,
    isLoading: isOppfolgingsplanLoading,
    isError: isOppfolgingsplanError,
  } = useHistorikkOppfolgingsplan();

  const { lederHistorikk, isLedereHistorikkLoading, isLedereHistorikkError } =
    useLedereHistorikk();

  const {
    aktivitetskravHistorikk,
    isAktivitetskravHistorikkLoading,
    isAktivitetskravHistorikkError,
  } = useAktivitetskravHistorikk();

  const {
    arbeidsuforhetHistorikk,
    isArbeidsuforhetHistorikkLoading,
    isArbeidsuforhetHistorikkError,
  } = useArbeidsuforhetHistorikk();

  const {
    manglendeMedvirkningHistorikk,
    isManglendeMedvirkningHistorikkLoading,
    isManglendeMedvirkningHistorikkError,
  } = useManglendeMedvirkningHistorikk();

  const { vedtakHistorikk, isVedtakHistorikkLoading, isVedtakHistorikkError } =
    useVedtakHistorikk();

  const {
    veilederHistorikk,
    isVeilederHistorikkLoading,
    isVeilederHistorikkError,
  } = useVeilederBrukerHistorikk();

  const {
    dialogmotekandidatHistorikk,
    isDialogmotekandidatHistorikkLoading,
    isDialogmotekandidatHistorikkError,
  } = useDialogmotekandidatHistorikk();

  const historikkEvents = motebehovHistorikk
    .concat(oppfolgingsplanHistorikk)
    .concat(lederHistorikk)
    .concat(aktivitetskravHistorikk)
    .concat(arbeidsuforhetHistorikk)
    .concat(manglendeMedvirkningHistorikk)
    .concat(vedtakHistorikk)
    .concat(veilederHistorikk)
    .concat(dialogmotekandidatHistorikk);

  const isHistorikkLoading =
    isOppfolgingsplanLoading ||
    isMotebehovLoading ||
    isLedereHistorikkLoading ||
    isAktivitetskravHistorikkLoading ||
    isArbeidsuforhetHistorikkLoading ||
    isManglendeMedvirkningHistorikkLoading ||
    isVedtakHistorikkLoading ||
    isVeilederHistorikkLoading ||
    isDialogmotekandidatHistorikkLoading;

  const isHistorikkError =
    isMotebehovError ||
    isOppfolgingsplanError ||
    isLedereHistorikkError ||
    isAktivitetskravHistorikkError ||
    isArbeidsuforhetHistorikkError ||
    isManglendeMedvirkningHistorikkError ||
    isVedtakHistorikkError ||
    isVeilederHistorikkError ||
    isDialogmotekandidatHistorikkError;

  return {
    historikkEvents,
    isHistorikkLoading,
    isHistorikkError,
  };
}
