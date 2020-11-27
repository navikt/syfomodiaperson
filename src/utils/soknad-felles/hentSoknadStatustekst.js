import { tilLesbarDatoMedArstall } from "@navikt/digisyfo-npm";
import { formaterOrgnr } from "../index";
import { KORRIGERT } from "../../enums/soknadstatuser";

const texts = {
  korrigert: "Korrigert",
};

const textSendtTilArbeidsgiverOgNav = (
  arbeidsgiver,
  orgnr,
  sendtTilNavDato
) => {
  return `Sendt til NAV og ${arbeidsgiver} (org. nr. ${orgnr}): ${sendtTilNavDato}`;
};

const textSendtTilNav = (sendtTilNavDato) => {
  return `Sendt til NAV: ${sendtTilNavDato}`;
};

const textSendtTilArbeidsgiver = (
  arbeidsgiver,
  orgnr,
  sendtTilArbeidsgiverDato
) => {
  return `Sendt til ${arbeidsgiver} (org. nr. ${orgnr}): ${sendtTilArbeidsgiverDato}`;
};

const hentStatustekst = (soknad) => {
  const soknadSendtTilNav =
    soknad.sendtTilNAVDato !== null || soknad.innsendtDato !== null;
  const soknadSendtTilArbeidsgiver = soknad.sendtTilArbeidsgiverDato !== null;

  const arbeidsgiver =
    soknad.arbeidsgiver && soknad.arbeidsgiver.navn
      ? soknad.arbeidsgiver.navn
      : soknad.arbeidsgiver
      ? soknad.arbeidsgiver
      : null;
  const orgnr =
    soknad.arbeidsgiver && soknad.arbeidsgiver.orgnummer
      ? formaterOrgnr(soknad.arbeidsgiver.orgnummer)
      : null;
  const sendtTilArbeidsgiverDato = soknadSendtTilArbeidsgiver
    ? tilLesbarDatoMedArstall(soknad.sendtTilArbeidsgiverDato)
    : null;
  const sendtTilNavDato = soknadSendtTilNav
    ? tilLesbarDatoMedArstall(soknad.sendtTilNAVDato || soknad.innsendtDato)
    : null;

  return soknad.status === KORRIGERT
    ? texts.korrigert
    : soknadSendtTilNav && soknadSendtTilArbeidsgiver
    ? textSendtTilArbeidsgiverOgNav(arbeidsgiver, orgnr, sendtTilNavDato)
    : soknadSendtTilNav && !soknadSendtTilArbeidsgiver
    ? textSendtTilNav(sendtTilNavDato)
    : textSendtTilArbeidsgiver(arbeidsgiver, orgnr, sendtTilArbeidsgiverDato);
};

export default hentStatustekst;
