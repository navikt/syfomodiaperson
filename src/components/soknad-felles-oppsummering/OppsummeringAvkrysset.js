import React from "react";
import PropTypes from "prop-types";

const OppsummeringAvkrysset = ({ tekst, id }) => {
  return (
    <div className="oppsummering__avkrysset" id={id}>
      <img src="/sykefravaer/img/png/check-box-1.png" alt="Avkrysset" />
      <span>{tekst}</span>
    </div>
  );
};

OppsummeringAvkrysset.propTypes = {
  tekst: PropTypes.string,
  id: PropTypes.string,
};

export default OppsummeringAvkrysset;
