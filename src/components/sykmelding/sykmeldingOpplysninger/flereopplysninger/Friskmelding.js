import React from "react";
import {
  getLedetekst,
  getSykmeldingCheckbox,
  keyValue,
  sykmelding as sykmeldingPt,
  tilLesbarDatoMedArstall,
} from "@navikt/digisyfo-npm";
import SykmeldingOpplysning from "./SykmeldingOpplysning";

const Friskmelding = ({ sykmelding, ledetekster }) => {
  const visSeksjon =
    sykmelding.friskmelding.antarReturSammeArbeidsgiver ||
    sykmelding.friskmelding.antattDatoReturSammeArbeidsgiver ||
    sykmelding.friskmelding.antarReturAnnenArbeidsgiver ||
    sykmelding.friskmelding.tilbakemeldingReturArbeid ||
    sykmelding.friskmelding.utenArbeidsgiverTilbakemelding ||
    sykmelding.friskmelding.utenArbeidsgiverAntarTilbakeIArbeid ||
    sykmelding.friskmelding.utenArbeidsgiverAntarTilbakeIArbeidDato ||
    sykmelding.friskmelding.utenArbeidsgiverTilbakemelding;

  if (!visSeksjon) {
    return <div />;
  }
  return (
    <div className="sykmeldingSeksjon">
      <h4 className="sykmeldingSeksjon__tittel">
        {getLedetekst("din-sykmelding.friskmelding.tittel", ledetekster)}
      </h4>
      {getSykmeldingCheckbox(
        sykmelding.friskmelding,
        "antarReturSammeArbeidsgiver",
        getLedetekst(
          "din-sykmelding.friskmelding.retur.samme.arbeidsgiver.tittel",
          ledetekster
        ),
        "typo-element blokk-s"
      )}
      {!sykmelding.friskmelding.antattDatoReturSammeArbeidsgiver ? null : (
        <SykmeldingOpplysning
          Overskrift="h5"
          className="subopplysning"
          tittel={getLedetekst(
            "din-sykmelding.friskmelding.retur.samme.arbeidsgiver.dato",
            ledetekster
          )}
        >
          <p className="opplysning__verdi js-antattDatoReturSammeArbeidsgiver">
            {tilLesbarDatoMedArstall(
              sykmelding.friskmelding.antattDatoReturSammeArbeidsgiver
            )}
          </p>
        </SykmeldingOpplysning>
      )}
      {getSykmeldingCheckbox(
        sykmelding.friskmelding,
        "antarReturAnnenArbeidsgiver",
        getLedetekst(
          "din-sykmelding.friskmelding.retur.annen.arbeidsgiver.tittel",
          ledetekster
        ),
        "typo-element blokk-s"
      )}
      {getSykmeldingCheckbox(
        sykmelding.friskmelding,
        "tilbakemeldingReturArbeid",
        getLedetekst(
          "din-sykmelding.friskmelding.retur.usikker.tittel",
          ledetekster
        ),
        "typo-element blokk-s"
      )}
      {!sykmelding.friskmelding.tilbakemeldingReturArbeid ? null : (
        <SykmeldingOpplysning
          className="subopplysning"
          tittel={getLedetekst(
            "din-sykmelding.friskmelding.retur.usikker.dato",
            ledetekster
          )}
        >
          <p className="opplysning__verdi js-tilbakemeldingReturArbeidDato">
            {tilLesbarDatoMedArstall(
              sykmelding.friskmelding.tilbakemeldingReturArbeid
            )}
          </p>
        </SykmeldingOpplysning>
      )}
      {getSykmeldingCheckbox(
        sykmelding.friskmelding,
        "utenArbeidsgiverAntarTilbakeIArbeid",
        getLedetekst(
          "din-sykmelding.friskmelding.uten.arbeidsgiver.retur.tittel",
          ledetekster
        ),
        "typo-element blokk-s"
      )}
      {!(
        sykmelding.friskmelding.utenArbeidsgiverAntarTilbakeIArbeid &&
        sykmelding.friskmelding.utenArbeidsgiverAntarTilbakeIArbeidDato
      ) ? null : (
        <SykmeldingOpplysning
          className="subopplysning"
          tittel={getLedetekst(
            "din-sykmelding.friskmelding.uten.arbeidsgiver.retur.dato",
            ledetekster
          )}
        >
          <p className="opplysning__verdi js-utenArbeidsgiverAntarTilbakeIArbeidDato">
            {tilLesbarDatoMedArstall(
              sykmelding.friskmelding.utenArbeidsgiverAntarTilbakeIArbeidDato
            )}
          </p>
        </SykmeldingOpplysning>
      )}
      {getSykmeldingCheckbox(
        sykmelding.friskmelding,
        "utenArbeidsgiverTilbakemelding",
        getLedetekst(
          "din-sykmelding.friskmelding.uten.arbeidsgiver.usikker.tittel",
          ledetekster
        ),
        "typo-element blokk-s"
      )}
      {!sykmelding.friskmelding.utenArbeidsgiverTilbakemelding ? null : (
        <SykmeldingOpplysning
          className="subopplysning"
          tittel={getLedetekst(
            "din-sykmelding.friskmelding.uten.arbeidsgiver.usikker.dato",
            ledetekster
          )}
        >
          <p className="js-utenArbeidsgiverTilbakemeldingDato">
            {tilLesbarDatoMedArstall(
              sykmelding.friskmelding.utenArbeidsgiverTilbakemelding
            )}
          </p>
        </SykmeldingOpplysning>
      )}
    </div>
  );
};

Friskmelding.propTypes = {
  sykmelding: sykmeldingPt,
  ledetekster: keyValue,
};

export default Friskmelding;
