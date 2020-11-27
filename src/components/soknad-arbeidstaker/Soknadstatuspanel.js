import React from "react";
import PropTypes from "prop-types";
import {
  tilLesbarDatoMedArstall,
  sykepengesoknadstatuser,
} from "@navikt/digisyfo-npm";
import Hjelpetekst from "nav-frontend-hjelpetekst";
import { sykepengesoknad as sykepengesoknadPt } from "../../propTypes";
import { erSendtTilBeggeMenIkkeSamtidig } from "../../utils/sykepengesoknadUtils";
import { formaterOrgnr } from "../../utils";
import Statuspanel, {
  StatusNokkelopplysning,
  Statusopplysninger,
} from "../Statuspanel";

const { SENDT, TIL_SENDING, KORRIGERT } = sykepengesoknadstatuser;

const texts = {
  sykepengeinfo: {
    tittel: "Utbetaling av sykepenger",
  },
  riktig:
    "Du har gjort det riktig! Det kan bare ta noen minutter før den er kommet fram til mottakeren. Du trenger ikke gjøre noe mer.",
  status: "Status",
  sendtTilNav: "Sendt til NAV:",

  korrigert: "Korrigert",
};

const getParams = (sykepengesoknad) => {
  return {
    "%ARBEIDSGIVER%": sykepengesoknad.arbeidsgiver.navn,
    "%ORGNR%": formaterOrgnr(sykepengesoknad.arbeidsgiver.orgnummer),
    "%SENDTTILNAVDATO%": tilLesbarDatoMedArstall(
      sykepengesoknad.sendtTilNAVDato
    ),
    "%SENDTTILARBEIDSGIVERDATO%": tilLesbarDatoMedArstall(
      sykepengesoknad.sendtTilArbeidsgiverDato
    ),
  };
};

const textSendtTilDato = (sykepengesoknad, params) => {
  const {
    arbeidsgiver,
    orgnr,
    sendtTilNavDato,
    sendtTilArbeidsgiverDato,
  } = params;

  if (
    sykepengesoknad.sendtTilArbeidsgiverDato &&
    sykepengesoknad.sendtTilNAVDato
  ) {
    return `Sendt til NAV og ${arbeidsgiver} (org. nr. ${orgnr}): ${sendtTilNavDato}`;
  }
  if (sykepengesoknad.sendtTilArbeidsgiverDato) {
    return `Sendt til ${arbeidsgiver} (org. nr. ${orgnr}): ${sendtTilArbeidsgiverDato}`;
  }
  if (sykepengesoknad.sendtTilNAVDato) {
    return `Sendt til NAV: ${sendtTilNavDato}`;
  }
  return "";
};

const textSenderTil = (sykepengesoknad, params) => {
  const { arbeidsgiver, orgnr } = params;

  if (
    sykepengesoknad.sendtTilArbeidsgiverDato &&
    sykepengesoknad.sendtTilNAVDato
  ) {
    return `Sender til NAV og ${arbeidsgiver} (org. nr. ${orgnr})...`;
  }
  if (sykepengesoknad.sendtTilArbeidsgiverDato) {
    return `Sender til ${arbeidsgiver} (org. nr. ${orgnr})...}`;
  }
  if (sykepengesoknad.sendtTilNAVDato) {
    return "Sender til NAV...";
  }
  return "";
};

const getStatusTekst = (sykepengesoknad) => {
  const params = getParams(sykepengesoknad);
  switch (sykepengesoknad.status) {
    case SENDT:
      return textSendtTilDato(sykepengesoknad, params);

    case TIL_SENDING:
      return textSenderTil(sykepengesoknad, params);

    case KORRIGERT:
      return texts.korrigert;

    default:
      return "Ukjent status";
  }
};

const tilSendingHjelpetekst = () => {
  return <Hjelpetekst>{texts.riktig}</Hjelpetekst>;
};

const textFromSykepengesoknad = (sykepengesoknad) => {
  if (
    sykepengesoknad.sendtTilArbeidsgiverDato &&
    sykepengesoknad.sendtTilNAVDato
  ) {
    return {
      __html:
        '<a href="https://www.nav.no/no/NAV+og+samfunn/Kontakt+NAV/Utbetalinger/Utbetalinger/Utbetalingsdatoer%2C+feriepenger+og+skattetrekk?kap=499628" target="_blank">Les om sykepenger og saksbehandlingstider.</a>',
    };
  }
  if (sykepengesoknad.sendtTilArbeidsgiverDato) {
    return { __html: "Du får sykepengene utbetalt fra arbeidsgiveren din." };
  }
  if (sykepengesoknad.sendtTilNAVDato) {
    return {
      __html:
        'Sykepenger utbetales etter at NAV har innvilget søknaden. <a href="https://www.nav.no/no/NAV+og+samfunn/Kontakt+NAV/Utbetalinger/Utbetalinger/Utbetalingsdatoer%2C+feriepenger+og+skattetrekk?kap=499628" target="_blank">Les om sykepenger og saksbehandlingstider.</a>',
    };
  }
  return "";
};

export const SykepengerInfo = ({ sykepengesoknad }) => {
  return (
    <StatusNokkelopplysning tittel={texts.sykepengeinfo.tittel}>
      <p dangerouslySetInnerHTML={textFromSykepengesoknad(sykepengesoknad)} />
    </StatusNokkelopplysning>
  );
};

SykepengerInfo.propTypes = {
  sykepengesoknad: sykepengesoknadPt,
};

const SendtLikt = ({ sykepengesoknad }) => {
  const tekst = getStatusTekst(sykepengesoknad);
  return (
    <Statusopplysninger>
      <StatusNokkelopplysning tittel={texts.status}>
        {sykepengesoknad.status === TIL_SENDING ? (
          <div>
            <span>{tekst}</span>
            {tilSendingHjelpetekst()}
          </div>
        ) : (
          <p>{tekst}</p>
        )}
      </StatusNokkelopplysning>
      <SykepengerInfo sykepengesoknad={sykepengesoknad} />
    </Statusopplysninger>
  );
};

SendtLikt.propTypes = {
  sykepengesoknad: sykepengesoknadPt,
};

const SendtUlikt = ({ sykepengesoknad }) => {
  const params = getParams(sykepengesoknad);

  const {
    arbeidsgiver,
    orgnr,
    sendtTilNavDato,
    sendtTilArbeidsgiverDato,
  } = params;

  return (
    <Statusopplysninger>
      <StatusNokkelopplysning tittel={texts.status}>
        <p>
          {`Sendt til NAV: ${sendtTilNavDato}`}
          <br />
          {`Sendt til ${arbeidsgiver} (org. nr. ${orgnr}): ${sendtTilArbeidsgiverDato}`}
        </p>
      </StatusNokkelopplysning>
      <SykepengerInfo sykepengesoknad={sykepengesoknad} />
    </Statusopplysninger>
  );
};

SendtUlikt.propTypes = {
  sykepengesoknad: sykepengesoknadPt,
};

const Soknadstatuspanel = ({ sykepengesoknad, children }) => {
  return (
    <Statuspanel enKolonne>
      {erSendtTilBeggeMenIkkeSamtidig(sykepengesoknad) ? (
        <SendtUlikt sykepengesoknad={sykepengesoknad} />
      ) : (
        <SendtLikt sykepengesoknad={sykepengesoknad} />
      )}
      {children}
    </Statuspanel>
  );
};

Soknadstatuspanel.propTypes = {
  sykepengesoknad: sykepengesoknadPt,
  children: PropTypes.node,
};

export default Soknadstatuspanel;
