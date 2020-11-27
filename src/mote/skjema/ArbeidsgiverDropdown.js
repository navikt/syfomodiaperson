import React from "react";
import PropTypes from "prop-types";
import { Select } from "nav-frontend-skjema";

const texts = {
  chooseArbeidsgiver: "Velg arbeidsgiver",
};

const ArbeidsgiverDropdown = ({ velgArbeidsgiver, ledere }) => {
  return (
    <div className="blokk">
      <Select
        onChange={(e) => {
          velgArbeidsgiver(e.target.value);
        }}
      >
        <option value="VELG">{texts.chooseArbeidsgiver}</option>
        {ledere
          .sort((a, b) => {
            if (a.navn > b.navn) {
              return 1;
            } else if (b.navn > a.navn) {
              return -1;
            }
            return 0;
          })
          .sort((a, b) => {
            if (a.organisasjonsnavn > b.organisasjonsnavn) {
              return 1;
            } else if (b.organisasjonsnavn > a.organisasjonsnavn) {
              return -1;
            }
            return 0;
          })
          .map((leder, idx) => {
            return (
              <option value={leder.orgnummer} key={idx}>
                {leder.organisasjonsnavn}
              </option>
            );
          })}
      </Select>
    </div>
  );
};

ArbeidsgiverDropdown.propTypes = {
  velgArbeidsgiver: PropTypes.func,
  ledere: PropTypes.array,
};

export default ArbeidsgiverDropdown;
