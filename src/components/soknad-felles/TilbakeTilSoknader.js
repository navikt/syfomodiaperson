import React from "react";
import PropTypes from "prop-types";
import Tilbakelenke from "../Tilbakelenke";

const TilbakeTilSoknader = ({ fnr }) => {
  return (
    <Tilbakelenke
      to={`/sykefravaer/${fnr}/sykepengesoknader`}
      tekst="Gå til sykepengesøknader"
    />
  );
};

TilbakeTilSoknader.propTypes = {
  fnr: PropTypes.string,
};

export default TilbakeTilSoknader;
