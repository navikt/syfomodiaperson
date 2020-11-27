import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Select } from "nav-frontend-skjema";
import * as actionCreators from "../../actions/sykmeldinger_actions";

const texts = {
  dato: "Dato",
  arbeidsgiver: "Arbeidsgiver",
  label: "Sorter etter",
};

const DropdownContainer = ({ alternativer, sorterSykmeldinger, status }) => {
  return (
    <Select
      label={texts.label}
      aria-controls={`sykmelding-liste-${status}`}
      onChange={(event) => {
        sorterSykmeldinger(event.target.value, status);
      }}
    >
      {alternativer.map((alt, idx) => {
        return (
          <option key={idx} value={alt.verdi}>
            {alt.tekst}
          </option>
        );
      })}
    </Select>
  );
};

DropdownContainer.propTypes = {
  alternativer: PropTypes.array,
  sorterSykmeldinger: PropTypes.func,
  status: PropTypes.string,
};

function mapStateToProps(state) {
  const ledetekster = state.ledetekster.data;

  return {
    ledetekster,
    alternativer: [
      {
        tekst: texts.dato,
        verdi: "fom",
      },
      {
        tekst: texts.arbeidsgiver,
        verdi: "arbeidsgiver",
      },
    ],
  };
}

const SykmeldingerSorteringContainer = connect(
  mapStateToProps,
  actionCreators
)(DropdownContainer);

export default SykmeldingerSorteringContainer;
