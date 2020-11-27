import React from "react";
import PropTypes from "prop-types";
import Tidspunkt from "./Tidspunkt";

const Tidspunkter = ({ antallNyeTidspunkt = 1, skjemanavn }) => {
  const tidspunker = [];
  for (let i = 0; i < antallNyeTidspunkt; i += 1) {
    tidspunker.push({});
  }
  return (
    <div className="motetidspunkter">
      {tidspunker.map((tidspunkt, index) => {
        return (
          <Tidspunkt skjemanavn={skjemanavn} tidspunkt={index} key={index} />
        );
      })}
    </div>
  );
};

Tidspunkter.propTypes = {
  antallNyeTidspunkt: PropTypes.number,
  skjemanavn: PropTypes.string.isRequired,
};

export default Tidspunkter;
