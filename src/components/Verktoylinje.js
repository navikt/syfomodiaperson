import React from "react";
import PropTypes from "prop-types";
import Knapp from "nav-frontend-knapper";

export const Verktoylinje = ({ children }) => {
  return <div className="verktoylinje">{children}</div>;
};

Verktoylinje.propTypes = {
  children: PropTypes.node,
};

export const VerktoyKnapp = ({ children }) => {
  return (
    <div className="verktoylinje__element">
      <Knapp type="standard" mini disabled>
        {children}
      </Knapp>
    </div>
  );
};

VerktoyKnapp.propTypes = {
  children: PropTypes.string,
};
