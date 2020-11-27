import React from "react";
import PropTypes from "prop-types";

export const SykmeldingCheckbox = ({ tekst, jsClassName, className = "" }) => {
  return (
    <p className={`checkboxOpplysning ${className} js-${jsClassName}`}>
      <img
        src={`${process.env.REACT_APP_CONTEXT_ROOT}/img/png/check-box-1.png`}
        className="ikon"
        alt="Huket av"
      />
      <span
        className="checkboxOpplysning__label"
        dangerouslySetInnerHTML={{ __html: tekst }}
      />
    </p>
  );
};

SykmeldingCheckbox.propTypes = {
  tekst: PropTypes.string,
  jsClassName: PropTypes.string,
  className: PropTypes.string,
};

export const SykmeldingCheckboxSelvstendig = ({ tekst, jsClassName }) => {
  return (
    <SykmeldingCheckbox
      tekst={tekst}
      jsClassName={jsClassName}
      className="typo-element blokk-m"
    />
  );
};

SykmeldingCheckboxSelvstendig.propTypes = {
  tekst: PropTypes.string,
  jsClassName: PropTypes.string,
};
