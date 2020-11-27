import React from "react";
import {
  getLedetekst,
  getSykmeldingOpplysning,
  keyValue,
  sykmelding as sykmeldingPt,
} from "@navikt/digisyfo-npm";

const MeldingTilArbeidsgiver = ({ sykmelding, ledetekster }) => {
  const visSeksjon = sykmelding.innspillTilArbeidsgiver;
  if (!visSeksjon) {
    return <span />;
  }
  return (
    <div className="sykmeldingSeksjon">
      <h4 className="sykmeldingSeksjon__tittel">
        {getLedetekst("din-sykmelding.meldingarbeidsgiver.tittel", ledetekster)}
      </h4>
      {getSykmeldingOpplysning(
        sykmelding,
        "innspillTilArbeidsgiver",
        getLedetekst(
          "din-sykmelding.meldingarbeidsgiver.innspill.tittel",
          ledetekster
        )
      )}
    </div>
  );
};

MeldingTilArbeidsgiver.propTypes = {
  sykmelding: sykmeldingPt,
  ledetekster: keyValue,
};

export default MeldingTilArbeidsgiver;
