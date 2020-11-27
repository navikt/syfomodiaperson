import React from "react";
import PropTypes from "prop-types";

const PersonkortInformasjon = ({ informasjonNokkelTekster, informasjon }) => {
  return Object.keys(informasjon).map((nokkel, idx) => {
    return (
      <dl key={`${nokkel}.${idx}`} className="personkortElement__informasjon">
        <dt>{informasjonNokkelTekster.get(nokkel)}</dt>
        <dd>{informasjon[nokkel]}</dd>
      </dl>
    );
  });
};

PersonkortInformasjon.propTypes = {
  informasjonNokkelTekster: PropTypes.shape(),
  informasjon: PropTypes.shape(),
};

export default PersonkortInformasjon;
