import React from "react";
import {
  tilLesbarDatoMedArstall,
  sykepengesoknadstatuser,
} from "@navikt/digisyfo-npm";
import Hjelpetekst from "nav-frontend-hjelpetekst";
import { soknad as soknadPt } from "../../propTypes";
import Statuspanel, {
  StatusNokkelopplysning,
  Statusopplysninger,
} from "../Statuspanel";

const texts = {
  sendt: "Sendt til NAV",
  sender: "Sender til NAV",
  hjelpetekst:
    "Du har gjort det riktig! Det kan bare ta noen minutter før den er kommet fram til mottakeren. Du trenger ikke gjøre noe mer.",
  dato: "Dato",
  status: "Status",
};

const { SENDT, TIL_SENDING } = sykepengesoknadstatuser;

const getStatusTekst = (soknad) => {
  switch (soknad.status) {
    case SENDT: {
      return texts.sendt;
    }
    case TIL_SENDING: {
      return texts.sender;
    }
    default: {
      return "Ukjent status";
    }
  }
};

export const tilSendingHjelpetekst = () => {
  return <Hjelpetekst>{texts.hjelpetekst}</Hjelpetekst>;
};

const SendtDato = ({ soknad }) => {
  return (
    <StatusNokkelopplysning tittel={texts.dato}>
      <p>{tilLesbarDatoMedArstall(soknad.innsendtDato)}</p>
    </StatusNokkelopplysning>
  );
};

SendtDato.propTypes = {
  soknad: soknadPt,
};

const StatuspanelUtland = ({ soknad }) => {
  const tekst = getStatusTekst(soknad);
  return (
    <Statuspanel>
      <Statusopplysninger>
        <StatusNokkelopplysning tittel={texts.status}>
          {soknad.status === TIL_SENDING ? (
            <div>
              <span>{tekst}</span>
              {tilSendingHjelpetekst()}
            </div>
          ) : (
            <p>{tekst}</p>
          )}
        </StatusNokkelopplysning>
        <SendtDato soknad={soknad} />
      </Statusopplysninger>
    </Statuspanel>
  );
};

StatuspanelUtland.propTypes = {
  soknad: soknadPt,
};

export default StatuspanelUtland;
