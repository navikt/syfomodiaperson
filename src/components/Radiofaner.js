import React from "react";
import PropTypes from "prop-types";
import { Radio } from "nav-frontend-skjema";
import HjelpetekstBase from "nav-frontend-hjelpetekst";

const Radiofaner = ({
  alternativer = [],
  valgtAlternativ,
  changeHandler,
  className,
  radioName,
}) => {
  return (
    <div className={`radiofaner ${className}`}>
      {alternativer.map((a, index) => {
        const erValgt = a.verdi === valgtAlternativ;
        const divClassname = `skjemaelement skjemaelement--horisontal ${
          a.hjelpetekst ? "medHjelpetekst" : ""
        }`;
        const inputId = `radio-${a.verdi}`;
        return (
          <div className={divClassname} key={index}>
            <Radio
              label={a.tittel}
              name={radioName}
              value={a.verdi}
              id={inputId}
              checked={erValgt}
              onChange={() => {
                changeHandler(a.verdi);
              }}
            />
            {a.hjelpetekst && (
              <HjelpetekstBase type="over" id="velg-arbeidssituasjon">
                <h3>{a.hjelpetekst.tittel}</h3>
                <p>{a.hjelpetekst.tekst}</p>
              </HjelpetekstBase>
            )}
          </div>
        );
      })}
    </div>
  );
};

const alternativ = PropTypes.shape({
  verdi: PropTypes.string,
  tittel: PropTypes.string,
});

Radiofaner.propTypes = {
  alternativer: PropTypes.arrayOf(alternativ),
  changeHandler: PropTypes.func,
  valgtAlternativ: PropTypes.string,
  className: PropTypes.string,
  radioName: PropTypes.string,
};

export default Radiofaner;
