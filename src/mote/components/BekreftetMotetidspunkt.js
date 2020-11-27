import React from "react";
import * as moterPropTypes from "../../propTypes";
import { ARBEIDSGIVER, BRUKER } from "../../konstanter";
import DatoOgTid from "./DatoOgTid";
import SvarMedIkon from "./SvarMedIkon";

const BekreftetMotetidspunkt = (props) => {
  const mote = props.mote;
  const arbeidsgiver = mote.deltakere.filter((d) => {
    return d.type === ARBEIDSGIVER;
  })[0];
  const arbeidstaker = mote.deltakere.filter((d) => {
    return d.type === BRUKER;
  })[0];
  const arbeidstakerSvar =
    arbeidstaker &&
    arbeidstaker.svar.filter((s) => {
      return s.id === mote.bekreftetAlternativ.id;
    })[0];
  const arbeidsgiversSvar =
    arbeidsgiver &&
    arbeidsgiver.svar.filter((s) => {
      return s.id === mote.bekreftetAlternativ.id;
    })[0];
  return (
    <div className="gronnRammeTidspunkt">
      <DatoOgTid tagName="h4" tid={mote.bekreftetAlternativ.tid} />
      <SvarMedIkon bruker={arbeidsgiver} svar={arbeidsgiversSvar} />
      {arbeidstaker && arbeidstakerSvar && (
        <SvarMedIkon bruker={arbeidstaker} svar={arbeidstakerSvar} />
      )}
    </div>
  );
};

BekreftetMotetidspunkt.propTypes = {
  mote: moterPropTypes.motePt,
};

export default BekreftetMotetidspunkt;
