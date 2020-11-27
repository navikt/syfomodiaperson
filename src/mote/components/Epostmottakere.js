import React from "react";
import PropTypes from "prop-types";
import * as moterPropTypes from "../../propTypes";
import { BRUKER, ARBEIDSGIVER } from "../../konstanter";

const texts = {
  arbeidsgiver: "Sendes til arbeidsgiver",
  arbeidstaker: "Sendes til arbeidstaker",
};

const Epostmottakere = ({ mote, arbeidstaker }) => {
  const sykmeldt = mote.deltakere.filter((d) => {
    return d.type === BRUKER;
  })[0];
  const arbeidsgiver = mote.deltakere.filter((d) => {
    return d.type === ARBEIDSGIVER;
  })[0];

  return (
    <div className="mottakere">
      <div className="epostinnhold__mottaker js-mottaker blokk">
        <h3>{texts.arbeidsgiver}</h3>
        <p>{arbeidsgiver.navn}</p>
      </div>
      {arbeidstaker.kontaktinfo.skalHaVarsel && (
        <div className="epostinnhold__mottaker js-mottaker blokk">
          <h3>{texts.arbeidstaker}</h3>
          <p>{sykmeldt.navn}</p>
        </div>
      )}
    </div>
  );
};

Epostmottakere.propTypes = {
  arbeidstaker: PropTypes.object,
  mote: moterPropTypes.motePt,
};

export default Epostmottakere;
