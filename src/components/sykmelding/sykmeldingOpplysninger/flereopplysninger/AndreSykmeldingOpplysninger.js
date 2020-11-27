import React from "react";
import {
  getLedetekst,
  getSykmeldingOpplysning,
  keyValue,
  sykmelding as sykmeldingPt,
} from "@navikt/digisyfo-npm";

const AndreSykmeldingOpplysninger = ({ sykmelding, ledetekster }) => {
  const visSeksjon =
    sykmelding.bekreftelse.sykmelderTlf ||
    sykmelding.bekreftelse.utstedelsesdato;
  if (!visSeksjon) {
    return <span />;
  }
  return (
    <div className="sykmeldingSeksjon">
      <h4 className="sykmeldingSeksjon__tittel">Annet</h4>
      {getSykmeldingOpplysning(
        sykmelding.bekreftelse,
        "sykmelderTlf",
        getLedetekst("din-sykmelding.annet.telefon", ledetekster)
      )}
    </div>
  );
};

AndreSykmeldingOpplysninger.propTypes = {
  sykmelding: sykmeldingPt,
  ledetekster: keyValue,
};

export default AndreSykmeldingOpplysninger;
