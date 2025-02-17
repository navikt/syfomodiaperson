import { HistorikkEvent } from "@/data/historikk/types/historikkTypes";
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

export interface HistorikkHook {
  isLoading: boolean;
  isError: boolean;
  events: HistorikkEvent[];
}

export function useHistorikk(): HistorikkHook {
  const motebehovHistorikk = useMotebehovHistorikk();
  const oppfolgingsplanHistorikk = useOppfolgingsplanHistorikk();
  const ledereHistorikk = useLedereHistorikk();
  const aktivitetskravHistorikk = useAktivitetskravHistorikk();
  const arbeidsuforhetHistorikk = useArbeidsuforhetHistorikk();
  const manglendeMedvirkningHistorikk = useManglendeMedvirkningHistorikk();
  const vedtakHistorikk = useVedtakHistorikk();
  const veilederTildelingHistorikk = useVeilederTildelingHistorikk();
  const dialogmotekandidatHistorikk = useDialogmotekandidatHistorikk();
  const dialogMedBehandlerHistorikk = useDialogMedBehandlerHistorikk();
  const senOppfolgingHistorikk = useSenOppfolgingHistorikk();
  const dialogmoteStatusEndringHistorikk =
    useDialogmoteStatusEndringHistorikk();
  const oppfolgingsoppgaveHistorikk = useOppfolgingsoppgaveHistorikk();

  const historikk: HistorikkHook[] = [
    motebehovHistorikk,
    oppfolgingsplanHistorikk,
    ledereHistorikk,
    aktivitetskravHistorikk,
    arbeidsuforhetHistorikk,
    manglendeMedvirkningHistorikk,
    vedtakHistorikk,
    veilederTildelingHistorikk,
    dialogMedBehandlerHistorikk,
    senOppfolgingHistorikk,
    dialogmotekandidatHistorikk,
    oppfolgingsoppgaveHistorikk,
    dialogmoteStatusEndringHistorikk,
  ];

  return {
    events: historikk.map((value) => value.events).flat(),
    isLoading: historikk.some((value) => value.isLoading),
    isError: historikk.some((value) => value.isError),
  };
}
