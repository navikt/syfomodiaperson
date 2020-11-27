import React from "react";
import PropTypes from "prop-types";

const PilOpp = ({ farge }) => {
  return (
    <svg style={{ flex: 1 }} width="14" height="14" viewBox="0 0 15.15 9">
      <path
        style={{
          fill: "none",
          stroke: farge,
          strokeLinecap: "round",
          strokeLinejoin: "round",
        }}
        d="M14.65 8.5L7.58.5.5 8.5"
      />
    </svg>
  );
};
PilOpp.propTypes = {
  farge: PropTypes.string,
};

export default PilOpp;
