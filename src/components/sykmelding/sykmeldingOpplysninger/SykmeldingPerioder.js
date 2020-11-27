import React from "react";
import PropTypes from "prop-types";
import SykmeldingPeriode from "./SykmeldingPeriode";
import {
  getDuration,
  keyValue,
  sorterPerioderEldsteFoerst,
  sykmeldingperiode as periodePt,
} from "@navikt/digisyfo-npm";

const SykmeldingPerioder = ({
  perioder = [],
  ledetekster,
  Overskrift = "h3",
}) => {
  return (
    <div
      className={`sykmeldingPerioder ${
        perioder.length > 1 ? "sykmeldingPerioder--flere" : ""
      }`}
    >
      {sorterPerioderEldsteFoerst(perioder).map((periode, index) => {
        return (
          <SykmeldingPeriode
            key={index}
            periode={periode}
            antallDager={getDuration(periode.fom, periode.tom)}
            ledetekster={ledetekster}
            Overskrift={Overskrift}
          />
        );
      })}
    </div>
  );
};

SykmeldingPerioder.propTypes = {
  perioder: PropTypes.arrayOf(periodePt),
  ledetekster: keyValue,
  Overskrift: PropTypes.string,
};

export default SykmeldingPerioder;
