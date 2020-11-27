import React from "react";
import PropTypes from "prop-types";
import Alertstripe from "nav-frontend-alertstriper";
import SykmeldingUtdrag from "../../connected-components/SykmeldingUtdrag";
import { sykepengesoknad as sykepengesoknadPt } from "../../propTypes";

const texts = {
  info:
    "Det er ikke lenger mulig å sende denne søknaden digitalt fordi fristen for å søke er gått ut.",
};

const UtgaattSoknad = ({ sykepengesoknad, fnr }) => {
  return (
    <div>
      <div className="panel blokk">
        <Alertstripe type="info">
          <p className="sist">{texts.info}</p>
        </Alertstripe>
      </div>
      <SykmeldingUtdrag soknad={sykepengesoknad} fnr={fnr} erApen />
    </div>
  );
};

UtgaattSoknad.propTypes = {
  sykepengesoknad: sykepengesoknadPt,
  fnr: PropTypes.string,
};

export default UtgaattSoknad;
