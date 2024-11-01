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
import { useVeilederTildelingHistorikk } from "@/hooks/historikk/useVeilederTildelingHistorikk";
import { useDialogmotekandidatHistorikk } from "@/hooks/historikk/useDialogmotekandidatHistorikk";
import { useDialogMedBehandlerHistorikk } from "@/hooks/historikk/useDialogMedBehandlerHistorikk";

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

  const veilederTildelingHistorikk = useVeilederTildelingHistorikk();

  const {
    dialogmotekandidatHistorikk,
    isDialogmotekandidatHistorikkLoading,
    isDialogmotekandidatHistorikkError,
  } = useDialogmotekandidatHistorikk();

  const dialogMedBehandlerHistorikk = useDialogMedBehandlerHistorikk();

  const historikkEvents = motebehovHistorikk
    .concat(oppfolgingsplanHistorikk)
    .concat(lederHistorikk)
    .concat(aktivitetskravHistorikk)
    .concat(arbeidsuforhetHistorikk)
    .concat(manglendeMedvirkningHistorikk)
    .concat(vedtakHistorikk)
    .concat(veilederTildelingHistorikk.events)
    .concat(dialogMedBehandlerHistorikk.events)
    .concat(dialogmotekandidatHistorikk);

  const isHistorikkLoading =
    isOppfolgingsplanLoading ||
    isMotebehovLoading ||
    isLedereHistorikkLoading ||
    isAktivitetskravHistorikkLoading ||
    isArbeidsuforhetHistorikkLoading ||
    isManglendeMedvirkningHistorikkLoading ||
    isVedtakHistorikkLoading ||
    veilederTildelingHistorikk.isLoading ||
    dialogMedBehandlerHistorikk.isLoading ||
    isDialogmotekandidatHistorikkLoading;

  const isHistorikkError =
    isMotebehovError ||
    isOppfolgingsplanError ||
    isLedereHistorikkError ||
    isAktivitetskravHistorikkError ||
    isArbeidsuforhetHistorikkError ||
    isManglendeMedvirkningHistorikkError ||
    isVedtakHistorikkError ||
    veilederTildelingHistorikk.isError ||
    dialogMedBehandlerHistorikk.isError ||
    isDialogmotekandidatHistorikkError;

  return {
    historikkEvents,
    isHistorikkLoading,
    isHistorikkError,
  };
}
