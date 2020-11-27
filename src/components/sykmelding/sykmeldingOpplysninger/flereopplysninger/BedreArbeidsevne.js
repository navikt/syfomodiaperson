import React from "react";
import {
  getLedetekst,
  getSykmeldingOpplysning,
  keyValue,
  sykmelding as sykmeldingPt,
} from "@navikt/digisyfo-npm";

const BedreArbeidsevne = ({ sykmelding, ledetekster }) => {
  const visSeksjon =
    sykmelding.arbeidsevne.tilretteleggingArbeidsplass ||
    sykmelding.arbeidsevne.tiltakNAV ||
    sykmelding.arbeidsevne.tiltakAndre;
  if (!visSeksjon) {
    return <span />;
  }
  return (
    <div className="sykmeldingSeksjon">
      <h4 className="sykmeldingSeksjon__tittel">
        {getLedetekst("din-sykmelding.arbeidsevne.tittel", ledetekster)}
      </h4>
      {getSykmeldingOpplysning(
        sykmelding.arbeidsevne,
        "tilretteleggingArbeidsplass",
        getLedetekst("din-sykmelding.arbeidsevne.tilrettelegging", ledetekster)
      )}
      {getSykmeldingOpplysning(
        sykmelding.arbeidsevne,
        "tiltakNAV",
        getLedetekst("din-sykmelding.arbeidsevne.tiltaknav", ledetekster)
      )}
      {getSykmeldingOpplysning(
        sykmelding.arbeidsevne,
        "tiltakAndre",
        getLedetekst("din-sykmelding.arbeidsevne.tiltakandre", ledetekster)
      )}
    </div>
  );
};

BedreArbeidsevne.propTypes = {
  sykmelding: sykmeldingPt,
  ledetekster: keyValue,
};

export default BedreArbeidsevne;
