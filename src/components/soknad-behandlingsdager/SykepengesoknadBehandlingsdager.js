import React from "react";
import PropTypes from "prop-types";
import Oppsummeringsvisning from "../soknad-felles-oppsummering/Oppsummeringsvisning";
import { brodsmule, soknad as soknadPt } from "../../propTypes";
import SoknadSpeiling from "../soknad-felles/SoknadSpeiling";
import StatuspanelBehandlingsdager from "./StatuspanelBehandlingsdager";

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

const SykepengesoknadBehandlingsdager = ({
  brukernavn,
  brodsmuler,
  soknad,
  fnr,
}) => {
  return (
    <SoknadSpeiling
      tittel="Søknad om sykepenger for enkeltstående behandlingsdager"
      brukernavn={brukernavn}
      brodsmuler={brodsmuler}
      fnr={fnr}
    >
      <StatuspanelBehandlingsdager soknad={soknad} />
      <OppsummeringPanel soknad={soknad} />
    </SoknadSpeiling>
  );
};

SykepengesoknadBehandlingsdager.propTypes = {
  brukernavn: PropTypes.string,
  brodsmuler: PropTypes.arrayOf(brodsmule),
  soknad: soknadPt,
  fnr: PropTypes.string,
};

export default SykepengesoknadBehandlingsdager;
