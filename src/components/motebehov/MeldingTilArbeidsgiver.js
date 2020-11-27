import React from "react";
import PropTypes from "prop-types";
import { erMeldingTilArbeidsgiverInformasjon } from "../../utils/sykmeldinger/sykmeldingUtils";

const tekster = {
  meldingTilArbeidsgiver: {
    header: "Melding til arbeidsgiver",
    innspillTittel: "Andre innspill til arbeidsgiver",
  },
};

export const MeldingTilArbeidsgiver = ({ sykmelding }) => {
  const innspillTilArbeidsgiver = sykmelding.innspillTilArbeidsgiver;
  const skalVise = erMeldingTilArbeidsgiverInformasjon(sykmelding);
  return (
    skalVise && (
      <div className="sykmeldingMotebehovVisning__avsnitt">
        <h5 className="undertittel">{tekster.meldingTilArbeidsgiver.header}</h5>
        {innspillTilArbeidsgiver && (
          <div>
            <h6 className="sporsmal">
              {tekster.meldingTilArbeidsgiver.innspillTittel}
            </h6>
            <p>{innspillTilArbeidsgiver}</p>
          </div>
        )}
      </div>
    )
  );
};

MeldingTilArbeidsgiver.propTypes = {
  sykmelding: PropTypes.object,
};

export default MeldingTilArbeidsgiver;
