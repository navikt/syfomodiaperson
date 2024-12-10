import { HistorikkEvent } from "@/data/historikk/types/historikkTypes";
import { useHistorikkMotebehovQuery } from "@/data/historikk/historikkQueryHooks";
import { useLedereHistorikk } from "@/hooks/historikk/useLedereHistorikk";
import { useAktivitetskravHistorikk } from "@/hooks/historikk/useAktivitetskravHistorikk";
import { useArbeidsuforhetHistorikk } from "@/hooks/historikk/useArbeidsuforhetHistorikk";
import { useManglendeMedvirkningHistorikk } from "@/hooks/historikk/useManglendeMedvirkningHistorikk";
import { useVedtakHistorikk } from "@/hooks/historikk/useFriskmeldingTilArbeidsformidligVedtakHistorikk";
import { useVeilederTildelingHistorikk } from "@/hooks/historikk/useVeilederTildelingHistorikk";
import { useDialogmotekandidatHistorikk } from "@/hooks/historikk/useDialogmotekandidatHistorikk";
import { useDialogMedBehandlerHistorikk } from "@/hooks/historikk/useDialogMedBehandlerHistorikk";
import { useSenOppfolgingHistorikk } from "@/hooks/historikk/useSenOppfolgingHistorikk";
import { useDialogmoteStatusEndringHistorikk } from "@/hooks/historikk/useDialogmoteStatusEndringHistorikk";
import { useOppfolgingsplanHistorikk } from "@/hooks/historikk/useOppfolgingsplanHistorikk";
import { useOppfolgingsoppgaveHistorikk } from "@/hooks/historikk/useOppfolgingsoppgaveHistorikk";
import { useMotebehovHistorikk } from "@/hooks/historikk/useMotebehovHistorikk";

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

  const motebehovNyHistorikk = useMotebehovHistorikk();

  const oppfolgingsplanHistorikk = useOppfolgingsplanHistorikk();

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

  const senOppfolgingHistorikk = useSenOppfolgingHistorikk();

  const dialogmoteStatusEndringHistorikk =
    useDialogmoteStatusEndringHistorikk();

  const oppfolgingsoppgaveHistorikk = useOppfolgingsoppgaveHistorikk();

  const historikkEvents = motebehovHistorikk
    .concat(motebehovNyHistorikk.events)
    .concat(oppfolgingsplanHistorikk.events)
    .concat(lederHistorikk)
    .concat(aktivitetskravHistorikk)
    .concat(arbeidsuforhetHistorikk)
    .concat(manglendeMedvirkningHistorikk)
    .concat(vedtakHistorikk)
    .concat(veilederTildelingHistorikk.events)
    .concat(dialogMedBehandlerHistorikk.events)
    .concat(senOppfolgingHistorikk.events)
    .concat(dialogmotekandidatHistorikk)
    .concat(oppfolgingsoppgaveHistorikk.events)
    .concat(dialogmoteStatusEndringHistorikk.events);

  const isHistorikkLoading =
    oppfolgingsplanHistorikk.isLoading ||
    isMotebehovLoading ||
    motebehovNyHistorikk.isLoading ||
    isLedereHistorikkLoading ||
    isAktivitetskravHistorikkLoading ||
    isArbeidsuforhetHistorikkLoading ||
    isManglendeMedvirkningHistorikkLoading ||
    isVedtakHistorikkLoading ||
    veilederTildelingHistorikk.isLoading ||
    dialogMedBehandlerHistorikk.isLoading ||
    senOppfolgingHistorikk.isLoading ||
    isDialogmotekandidatHistorikkLoading ||
    oppfolgingsoppgaveHistorikk.isLoading ||
    dialogmoteStatusEndringHistorikk.isLoading;

  const isHistorikkError =
    isMotebehovError ||
    motebehovNyHistorikk.isError ||
    oppfolgingsplanHistorikk.isError ||
    isLedereHistorikkError ||
    isAktivitetskravHistorikkError ||
    isArbeidsuforhetHistorikkError ||
    isManglendeMedvirkningHistorikkError ||
    isVedtakHistorikkError ||
    veilederTildelingHistorikk.isError ||
    dialogMedBehandlerHistorikk.isError ||
    senOppfolgingHistorikk.isError ||
    isDialogmotekandidatHistorikkError ||
    oppfolgingsoppgaveHistorikk.isError ||
    dialogmoteStatusEndringHistorikk.isError;

  return {
    historikkEvents,
    isHistorikkLoading,
    isHistorikkError,
  };
}
