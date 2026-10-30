import {
  DialogmoteDTO,
  DialogmoteStatus,
  MotedeltakerVarselType,
  SvarType,
} from "@/sider/dialogmoter/types/dialogmoteTypes";
import { PersonOppgave } from "@/data/personoppgave/types/PersonOppgave";
import dayjs from "dayjs";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import { EndreSkjemaValues } from "@/sider/dialogmoter/types/skjemaTypes";
import { genererDato } from "@/sider/dialogmoter/utils";

export const isAktivtDialogmote = (dialogmote: DialogmoteDTO): boolean => {
  return (
    dialogmote.status === DialogmoteStatus.INNKALT ||
    dialogmote.status === DialogmoteStatus.NYTT_TID_STED ||
    dialogmote.status === DialogmoteStatus.ENDRET
  );
};

export const isPersonoppgaveCompletedAfterLastMoteEndring = (
  oppgave: PersonOppgave,
  dialogmote: DialogmoteDTO,
) => {
  const behandletTidspunkt = dayjs(oppgave.behandletTidspunkt);
  const lastMoteEndring = dayjs(
    dialogmote.arbeidstaker.varselList[0]?.createdAt || null,
  );

  return behandletTidspunkt.isAfter(lastMoteEndring);
};

export const getSvarTekst = (
  svarTidspunkt: string,
  svarType: SvarType,
  antallSvar = 1,
) => {
  const mottattPrefiks =
    antallSvar > 1 ? "Oppdatering mottatt" : "Svar mottatt";
  const mottattTekst = `${mottattPrefiks} ${tilLesbarDatoMedArUtenManedNavn(
    svarTidspunkt,
  )}`;
  switch (svarType) {
    case SvarType.KOMMER:
      return `kommer - ${mottattTekst}`;
    case SvarType.NYTT_TID_STED:
      return `ønsker å endre tidspunkt eller sted - ${mottattTekst}`;
    case SvarType.KOMMER_IKKE:
      return `ønsker å avlyse - ${mottattTekst}`;
  }
};

export const getHarAapnetTekst = (
  varselType: MotedeltakerVarselType | undefined,
  lestDato: string | undefined,
): string => {
  const lestDatoString = tilLesbarDatoMedArUtenManedNavn(lestDato);
  switch (varselType) {
    case MotedeltakerVarselType.INNKALT:
      return lestDato
        ? `åpnet innkallingen ${lestDatoString} - Har ikke gitt svar`
        : "har ikke åpnet innkallingen";
    case MotedeltakerVarselType.NYTT_TID_STED:
    case MotedeltakerVarselType.ENDRET:
      return lestDato
        ? `åpnet endringen ${lestDatoString} - Har ikke gitt svar`
        : "har ikke åpnet endringen";
    default:
      return "";
  }
};

/**
 * Sjekker om skjemaverdiene inneholder en endring som isdialogmote godtar.
 * Speiler `finnEndringer` i isdialogmote: tid, sted eller videolenke må være endret,
 * eller en ny behandler må være lagt til. Begrunnelser alene regnes ikke som endring.
 */
export function harEndringer(
  dialogmote: DialogmoteDTO,
  values: EndreSkjemaValues,
): boolean {
  const nyTid = genererDato(values.dato, values.klokkeslett);
  const isTidEndret = !dayjs(nyTid).isSame(dayjs(dialogmote.tid), "minute");
  const isStedEndret = values.sted !== dialogmote.sted;
  const isVideoLinkEndret =
    (values.videoLink?.trim() ?? "") !== (dialogmote.videoLink ?? "");
  const hasNyBehandler = !!values.nyBehandler;

  return isTidEndret || isStedEndret || isVideoLinkEndret || hasNyBehandler;
}
