import { HistorikkEvent } from "@/data/historikk/types/historikkTypes";
import { useBehandlerdialogQuery } from "@/data/behandlerdialog/behandlerdialogQueryHooks";
import {
  MeldingDTO,
  MeldingResponseDTO,
} from "@/data/behandlerdialog/behandlerdialogTypes";
import { meldingTypeTexts } from "@/data/behandlerdialog/behandlerdialogTexts";

interface DialogMedBehandlerHistorikk {
  isLoading: boolean;
  isError: boolean;
  events: HistorikkEvent[];
}

function avsenderText(dialogmelding: MeldingDTO): string {
  return dialogmelding.innkommende
    ? dialogmelding.behandlerNavn ?? "Mangler navn på behandler"
    : dialogmelding.veilederIdent ?? "Mangler ident på veileder";
}

function createHistorikkEvents(
  dialogmeldinger: MeldingDTO[]
): HistorikkEvent[] {
  return dialogmeldinger.map((melding) => {
    const avsender = avsenderText(melding);
    return {
      opprettetAv: melding.veilederIdent ?? undefined,
      tekst: `Avsender: ${avsender} - ${meldingTypeTexts[melding.type]}`,
      tidspunkt: melding.tidspunkt,
      kilde: "DIALOG_MED_BEHANDLER",
    };
  });
}

function flattenDialogmeldinger(
  dialogmeldingerMedBehandler: MeldingResponseDTO | undefined
): MeldingDTO[] {
  const conversations = dialogmeldingerMedBehandler?.conversations ?? [];
  return Object.entries(conversations).flatMap(([, meldinger]) => meldinger);
}

export function useDialogMedBehandlerHistorikk(): DialogMedBehandlerHistorikk {
  const {
    data: behandlerdialoger,
    isLoading: isBehandlerdialogLoading,
    isError: isBehandlerdialogError,
  } = useBehandlerdialogQuery();

  const historikkEvents = createHistorikkEvents(
    flattenDialogmeldinger(behandlerdialoger)
  );

  return {
    isLoading: isBehandlerdialogLoading,
    isError: isBehandlerdialogError,
    events: historikkEvents,
  };
}
