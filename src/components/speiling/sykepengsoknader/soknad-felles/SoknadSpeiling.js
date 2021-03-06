import React from "react";
import PropTypes from "prop-types";
import Speilingvarsel from "../../Speilingvarsel";
import Brodsmuler from "../../Brodsmuler";
import SidetoppSpeilet from "../../../SidetoppSpeilet";
import TilbakeTilSoknader from "./TilbakeTilSoknader";
import { brodsmule } from "../../../../propTypes";

const SoknadSpeiling = ({
  brukernavn,
  children,
  brodsmuler,
  tittel = "Søknad om sykepenger",
}) => {
  return (
    <div>
      <Speilingvarsel brukernavn={brukernavn} />
      <div className="speiling">
        <Brodsmuler brodsmuler={brodsmuler} />
        <SidetoppSpeilet tittel={tittel} />
        <div className="blokk">{children}</div>
        <TilbakeTilSoknader />
      </div>
    </div>
  );
};

SoknadSpeiling.propTypes = {
  brukernavn: PropTypes.string,
  children: PropTypes.node,
  brodsmuler: PropTypes.arrayOf(brodsmule),
  tittel: PropTypes.string,
};

export default SoknadSpeiling;
