import React from "react";
import PropTypes from "prop-types";
import { toDatePrettyPrint } from "@navikt/digisyfo-npm";
import SykmeldingUtdrag from "../../connected-components/SykmeldingUtdrag";
import { sykepengesoknad as sykepengesoknadPt } from "../../propTypes";
import Statuspanel, {
  StatusNokkelopplysning,
  Statusopplysninger,
} from "../Statuspanel";
import VerktoylinjeGjenapne from "../soknad-felles/VerktoylinjeGjenapneSoknad";

const texts = {
  korrigert: "Sendt",
  tilSending: "Sender...",
  sendt: "Sendt til arbeidsgiver",
  avbrutt: "Avbrutt av deg",
};

const textSykepengesoknadStatus = (status) => {
  switch (status) {
    case "KORRIGERT":
      return texts.korrigert;
    case "TIL_SENDING":
      return texts.tilSending;
    case "SENDT":
    case "SENDT.til-arbeidsgiver":
      return texts.sendt;
    case "AVBRUTT":
    case "SLETTET_UTKAST":
      return texts.avbrutt;
    default:
      return "";
  }
};

const AvbruttSoknad = ({ sykepengesoknad, fnr }) => {
  return (
    <div>
      <Statuspanel>
        <Statusopplysninger>
          <StatusNokkelopplysning tittel="Status">
            <p>{textSykepengesoknadStatus(sykepengesoknad.status)}</p>
          </StatusNokkelopplysning>
          <StatusNokkelopplysning tittel="Dato avbrutt">
            <p>{toDatePrettyPrint(sykepengesoknad.avbruttDato)}</p>
          </StatusNokkelopplysning>
        </Statusopplysninger>
        <VerktoylinjeGjenapne soknad={sykepengesoknad} />
      </Statuspanel>
      <SykmeldingUtdrag soknad={sykepengesoknad} fnr={fnr} erApen />
    </div>
  );
};

AvbruttSoknad.propTypes = {
  sykepengesoknad: sykepengesoknadPt,
  fnr: PropTypes.string,
};

export default AvbruttSoknad;
