import React from "react";
import PropTypes from "prop-types";
import {
  ArbeidsgiversSykmeldingOpplysninger,
  Utvidbar,
  keyValue,
} from "@navikt/digisyfo-npm";

const ArbeidsgiversSykmelding = ({
  sykmelding,
  ledetekster,
  Overskrift = "H2",
  erApen = false,
}) => {
  return (
    <Utvidbar
      tittel="Dette får arbeidsgiveren din se"
      ikon="svg/doctor-2.svg"
      ikonHover="svg/doctor-2_hover.svg"
      ikonAltTekst="Lege"
      erApen={erApen}
      variant="lilla"
      Overskrift={Overskrift}
    >
      <ArbeidsgiversSykmeldingOpplysninger
        sykmelding={sykmelding}
        ledetekster={ledetekster}
      />
    </Utvidbar>
  );
};

ArbeidsgiversSykmelding.propTypes = {
  sykmelding: PropTypes.object,
  ledetekster: keyValue,
  Overskrift: PropTypes.string,
  erApen: PropTypes.bool,
};

export default ArbeidsgiversSykmelding;
