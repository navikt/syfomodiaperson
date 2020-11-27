import React from "react";
import PropTypes from "prop-types";
import { getDuration, toDate } from "@navikt/digisyfo-npm";

const textBehandlingsdagEnDag = (behandlingsdager, dager) => {
  return `${behandlingsdager} behandlingsdag i løpet av ${dager} dag\n`;
};

const textBehandlingsdager = (behandlingsdager, dager) => {
  return `${behandlingsdager} behandlingsdag i løpet av ${dager} dager\n`;
};

const textEnDagIngenGrad = (behandlingsdager) => {
  return `${behandlingsdager} behandlingsdag\n`;
};

const textReisetilskuddEnDag = (dager) => {
  return `Reisetilskudd i ${dager} dag\n`;
};

const textReisetilskudd = (dager) => {
  return `Reisetilskudd i ${dager} dager\n`;
};

const textReisetilskuddGradert = (grad, dager) => {
  return `${grad} % sykmelding med reisetilskudd i ${dager} dager\n`;
};

const textAvventende = (arbeidsgiver, dager) => {
  return `Avventende sykmelding fra ${arbeidsgiver} i ${dager} dager`;
};

const textAvventendeEnDag = (arbeidsgiver, dager) => {
  return `Avventende sykmelding fra ${arbeidsgiver} i ${dager} dag`;
};

const textAvventedneEnDagUtenArbeidsgiver = (dager) => {
  return `Avventende sykemelding i ${dager} dag\n`;
};

const textAvventedneUtenArbeidsgiver = (dager) => {
  return `Avventende sykemelding i ${dager} dager\n`;
};

const textDefaultArbeidsgiver = (arbeidsgiver) => {
  return arbeidsgiver ? ` sykmeldt fra ${arbeidsgiver}` : "";
};

const textDefaultDager = (dager) => {
  return dager === 1 ? ` i ${dager} dag` : ` i ${dager} dager`;
};

const textDefault = (grad, arbeidsgiver, dager) => {
  const textArbeidsgiver = textDefaultArbeidsgiver(arbeidsgiver);
  const textDager = textDefaultDager(dager);
  return `${grad} %${textArbeidsgiver}${textDager}`;
};

const SykmeldingPeriodeInfo = ({ periode, arbeidsgiver, Element = "p" }) => {
  const enDag = toDate(periode.fom).getTime() === toDate(periode.tom).getTime();
  const ingenGrad = periode.grad === null;
  const utenArbeidsgiver = !arbeidsgiver;
  const gradert = periode.grad && periode.grad !== 100;

  let text = textDefault(
    periode.grad,
    arbeidsgiver,
    getDuration(periode.fom, periode.tom)
  );

  if (
    periode.behandlingsdager === 1 &&
    ((enDag && utenArbeidsgiver && ingenGrad) || (enDag && ingenGrad))
  ) {
    text = textBehandlingsdagEnDag(
      periode.behandlingsdager,
      getDuration(periode.fom, periode.tom)
    );
  }

  if (periode.behandlingsdager > 1) {
    text = textBehandlingsdager(
      periode.behandlingsdager,
      getDuration(periode.fom, periode.tom)
    );

    if (enDag && ingenGrad) {
      text = textEnDagIngenGrad(periode.behandlingsdager);
    }
  }
  if (periode.reisetilskudd) {
    text = textReisetilskudd(getDuration(periode.fom, periode.tom));

    if (enDag) {
      text = textReisetilskuddEnDag(getDuration(periode.fom, periode.tom));
    }

    if (gradert) {
      text = textReisetilskuddGradert(
        periode.grad,
        getDuration(periode.fom, periode.tom)
      );
    }
  }
  if (periode.avventende) {
    text = textAvventende(arbeidsgiver, getDuration(periode.fom, periode.tom));

    if (enDag) {
      text = textAvventendeEnDag(
        arbeidsgiver,
        getDuration(periode.fom, periode.tom)
      );
    }

    if (enDag && utenArbeidsgiver) {
      text = textAvventedneEnDagUtenArbeidsgiver(
        arbeidsgiver,
        getDuration(periode.fom, periode.tom)
      );
    }
    if (utenArbeidsgiver) {
      text = textAvventedneUtenArbeidsgiver(
        getDuration(periode.fom, periode.tom)
      );
    }
  }
  return <Element className="js-periode">{text}</Element>;
};

SykmeldingPeriodeInfo.propTypes = {
  periode: PropTypes.object,
  arbeidsgiver: PropTypes.string,
  Element: PropTypes.string,
};

export default SykmeldingPeriodeInfo;
