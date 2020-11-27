import React from "react";
import PropTypes from "prop-types";
import { tilLesbarDatoMedArstall } from "@navikt/digisyfo-npm";
import { Checkbox } from "nav-frontend-skjema";

const TilbakeIArbeidCheckboxMedSporsmalOgDato = ({
  checkboxLabel,
  sporsmal,
  returDato,
}) => {
  return (
    <div>
      <Checkbox
        className="sykmeldingMotebehovVisning__checkbox"
        label={checkboxLabel}
        checked
        disabled
      />
      <h6 className="sporsmal">{sporsmal}</h6>
      <p>{tilLesbarDatoMedArstall(returDato)}</p>
    </div>
  );
};

TilbakeIArbeidCheckboxMedSporsmalOgDato.propTypes = {
  checkboxLabel: PropTypes.string,
  sporsmal: PropTypes.string,
  returDato: PropTypes.instanceOf(Date),
};

export default TilbakeIArbeidCheckboxMedSporsmalOgDato;
