import React from "react";
import PropTypes from "prop-types";
import Tilbakelenke from "../Tilbakelenke";

const texts = {
  tilbake: "Gå til dine sykmeldinger\n",
};

const LenkeTilDineSykmeldinger = ({ fnr }) => {
  return (
    <Tilbakelenke
      to={`/sykefravaer/${fnr}/sykmeldinger`}
      tekst={texts.tilbake}
    />
  );
};

LenkeTilDineSykmeldinger.propTypes = {
  fnr: PropTypes.string,
};

export default LenkeTilDineSykmeldinger;
