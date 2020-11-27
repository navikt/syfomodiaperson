import React from "react";
import PropTypes from "prop-types";
import PlanlagtTeaser from "./PlanlagtTeaser";
import { soknadEllerSykepengesoknad } from "../../propTypes";

const PlanlagteTeasere = ({ sykepengesoknader, tittel = "" }) => {
  return (
    <div className="blokk--l">
      <header className="inngangspanelerHeader">
        <h2 className="inngangspanelerHeader__tittel">{tittel}</h2>
      </header>
      <div className="js-planlagte-soknader">
        {sykepengesoknader.map((soknad, idx) => {
          return <PlanlagtTeaser key={idx} soknad={soknad} />;
        })}
      </div>
    </div>
  );
};

PlanlagteTeasere.propTypes = {
  sykepengesoknader: PropTypes.arrayOf(soknadEllerSykepengesoknad),
  tittel: PropTypes.string,
};

export default PlanlagteTeasere;
