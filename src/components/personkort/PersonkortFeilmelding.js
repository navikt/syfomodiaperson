import React from "react";
import PropTypes from "prop-types";
import Alertstripe from "nav-frontend-alertstriper";

const PersonkortFeilmelding = ({ children }) => {
  return <Alertstripe type="info">{children}</Alertstripe>;
};

PersonkortFeilmelding.propTypes = {
  children: PropTypes.node,
};

export default PersonkortFeilmelding;
