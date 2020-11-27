import React from "react";
import PropTypes from "prop-types";
import {
  getLedetekst,
  keyValue,
  tilLesbarPeriodeMedArstall,
  sykmeldingperiode as periodePt,
} from "@navikt/digisyfo-npm";

const SykmeldingPeriode = ({
  periode,
  antallDager = 1,
  ledetekster,
  Overskrift = "h3",
}) => {
  const dagNokkel =
    antallDager === 1
      ? "din-sykmelding.periode.dag"
      : "din-sykmelding.periode.dager";
  return (
    <div className="nokkelopplysning">
      <Overskrift className="nokkelopplysning__tittel">
        {getLedetekst("din-sykmelding.periode.tittel", ledetekster)}
      </Overskrift>
      <p className="js-periode blokk-xxs">
        <strong>{tilLesbarPeriodeMedArstall(periode.fom, periode.tom)}</strong>{" "}
        &bull; {antallDager}&nbsp;{getLedetekst(dagNokkel, ledetekster)}
      </p>
      {periode.grad ? (
        <p className="js-grad">
          {periode.grad} % sykmeldt
          {periode.reisetilskudd && periode.grad > 0 && periode.grad < 100
            ? ` ${getLedetekst(
                "din-sykmelding.periode.med.reisetilskudd",
                ledetekster
              )}`
            : null}
        </p>
      ) : (
        ""
      )}
      {periode.behandlingsdager ? (
        <p className="js-behandlingsdager">
          {periode.behandlingsdager}{" "}
          {getLedetekst("din-sykmelding.periode.behandlingsdager", ledetekster)}
        </p>
      ) : null}
      {periode.reisetilskudd && periode.grad === null ? (
        <p className="js-reisetilskudd">
          {getLedetekst(
            "din-sykmelding.periode.reisetilskudd.tittel",
            ledetekster
          )}
        </p>
      ) : null}
      {periode.avventende ? (
        <div className="blokk">
          <p className="js-avventende">
            {getLedetekst("din-sykmelding.periode.avventende", ledetekster)}
          </p>
        </div>
      ) : null}
      {periode.avventende ? (
        <h4 className="nokkelopplysning__tittel">
          {getLedetekst(
            "din-sykmelding.periode.avventende.innspill",
            ledetekster
          )}
        </h4>
      ) : null}
      {periode.avventende ? <p>{periode.avventende}</p> : ""}
    </div>
  );
};

SykmeldingPeriode.propTypes = {
  periode: periodePt,
  antallDager: PropTypes.number,
  ledetekster: keyValue,
  Overskrift: PropTypes.string,
};

export default SykmeldingPeriode;
