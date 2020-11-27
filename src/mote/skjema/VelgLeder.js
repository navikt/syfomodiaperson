import React from "react";
import PropTypes from "prop-types";
import ArbeidsgiverDropdown from "./ArbeidsgiverDropdown";

const texts = {
  name: "Nærmeste leders navn",
  email: "E-post",
};

const ValgtLeder = ({ valgtArbeidsgiver }) => {
  return (
    <div>
      <div className="navInput blokk">
        <label htmlFor="js-ledernavn">{texts.name}</label>
        <label className="input--xxl textfieldLocked">
          {valgtArbeidsgiver.navn}
        </label>
      </div>
      <div className="navInput blokk ">
        <label htmlFor="js-lederepost">{texts.email}</label>
        <label className="input--xxl textfieldLocked">
          {valgtArbeidsgiver.epost}
        </label>
      </div>
    </div>
  );
};

ValgtLeder.propTypes = {
  valgtArbeidsgiver: PropTypes.object,
};

const VelgLeder = ({ ledere, valgtArbeidsgiver, velgArbeidsgiver }) => {
  const valgtLeder =
    ledere.filter((leder) => {
      return leder.orgnummer === valgtArbeidsgiver;
    })[0] || null;
  return (
    <div>
      <ArbeidsgiverDropdown
        velgArbeidsgiver={velgArbeidsgiver}
        ledere={ledere}
      />
      {valgtArbeidsgiver !== "VELG" && (
        <ValgtLeder valgtArbeidsgiver={valgtLeder} />
      )}
    </div>
  );
};

VelgLeder.propTypes = {
  velgArbeidsgiver: PropTypes.func,
  valgtArbeidsgiver: PropTypes.string,
  ledere: PropTypes.array,
};

export default VelgLeder;
