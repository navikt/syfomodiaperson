import React from "react";
import PropTypes from "prop-types";
import Oppsummeringsvisning from "../soknad-felles-oppsummering/Oppsummeringsvisning";
import { brodsmule, soknad as soknadPt } from "../../propTypes";
import SoknadSpeiling from "../soknad-felles/SoknadSpeiling";
import StatuspanelUtland from "./StatuspanelUtland";

const texts = {
  oppsummering: "Oppsummering av søknaden",
};

const OppsummeringPanel = ({ soknad }) => {
  return (
    <div className="panel blokk">
      <h2 className="panel__tittel blokk--xs"> {texts.oppsummering}</h2>
      <Oppsummeringsvisning soknad={soknad} />
    </div>
  );
};

OppsummeringPanel.propTypes = {
  soknad: soknadPt,
};

const SykepengesoknadUtland = ({ brukernavn, brodsmuler, soknad, fnr }) => {
  return (
    <SoknadSpeiling
      tittel="Søknad om sykepenger under opphold utenfor Norge"
      brukernavn={brukernavn}
      brodsmuler={brodsmuler}
      fnr={fnr}
    >
      <StatuspanelUtland soknad={soknad} />
      <OppsummeringPanel soknad={soknad} />
    </SoknadSpeiling>
  );
};

SykepengesoknadUtland.propTypes = {
  brukernavn: PropTypes.string,
  brodsmuler: PropTypes.arrayOf(brodsmule),
  soknad: soknadPt,
  fnr: PropTypes.string,
};

export default SykepengesoknadUtland;
