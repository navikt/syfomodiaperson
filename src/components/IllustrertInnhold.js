import React from "react";
import PropTypes from "prop-types";

const IllustrertInnhold = ({ ikon, ikonAlt, children }) => {
  return (
    <div className="illustrertInnhold">
      <div className="illustrertInnhold__ikon">
        <img src={ikon} alt={ikonAlt} />
      </div>
      <div className="illustrertInnhold__innhold">{children}</div>
    </div>
  );
};

IllustrertInnhold.propTypes = {
  ikon: PropTypes.string,
  ikonAlt: PropTypes.string,
  children: PropTypes.element,
};

export default IllustrertInnhold;
