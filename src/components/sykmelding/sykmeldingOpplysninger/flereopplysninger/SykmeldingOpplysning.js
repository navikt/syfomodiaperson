import React from "react";
import PropTypes from "prop-types";

const SykmeldingOpplysning = ({
  tittel,
  children,
  Overskrift = "h5",
  className = "",
}) => {
  return (
    <div className={`opplysning ${className}`}>
      {tittel ? (
        <Overskrift
          className="opplysning__tittel"
          dangerouslySetInnerHTML={{ __html: tittel }}
        />
      ) : null}
      {children}
    </div>
  );
};

SykmeldingOpplysning.propTypes = {
  tittel: PropTypes.string.isRequired,
  children: PropTypes.element,
  Overskrift: PropTypes.string,
  className: PropTypes.string,
};

export default SykmeldingOpplysning;
