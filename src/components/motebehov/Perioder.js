import React from "react";
import PropTypes from "prop-types";
import { tilLesbarPeriodeMedArUtenManednavn } from "../../utils/datoUtils";
import BoksRad from "./BoksRad";

const kolonne2Tekst = (periode) => {
  if (!!periode.behandlingsdager) {
    return periode.behandlingsdager === 1
      ? `${periode.behandlingsdager} behandlingsdag`
      : `${periode.behandlingsdager} behandlingsdager`;
  }
  if (!!periode.reisetilskudd) {
    return !!periode.grad
      ? `${periode.grad}% sykmeldt med reisetilskudd`
      : "Full jobb med reisetilskudd";
  }
  if (!!periode.avventende) {
    return "Avventende";
  }
  return `${periode.grad}%`;
};

export const PeriodeBoks = ({ periode }) => {
  return (
    <div className="sykmeldingMotebehovVisning__periodeBoks">
      <BoksRad
        kolonne1Tekst={`${tilLesbarPeriodeMedArUtenManednavn(
          periode.fom,
          periode.tom
        )}`}
        kolonne2Tekst={kolonne2Tekst(periode)}
        erTittel
      />
    </div>
  );
};

PeriodeBoks.propTypes = {
  periode: PropTypes.object,
};

export const Perioder = ({ perioder }) => {
  return (
    <div className="sykmeldingMotebehovVisning__perioder">
      <h6 className="sporsmal">Perioder</h6>
      {perioder.map((periode, index) => {
        return <PeriodeBoks key={index} periode={periode} />;
      })}
    </div>
  );
};

Perioder.propTypes = {
  perioder: PropTypes.arrayOf(PropTypes.object),
};

export default Perioder;
