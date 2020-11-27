import React from "react";
import PropTypes from "prop-types";
import SoknadTeaser from "./SoknadTeaser";
import { soknadEllerSykepengesoknad } from "../../propTypes";

const SoknaderTeasere = ({
  sykepengesoknader,
  fnr,
  className,
  tittel = "",
  tomListeTekst,
  id,
}) => {
  return (
    <div className="blokk--l">
      <header className="inngangspanelerHeader">
        <h2 className="inngangspanelerHeader__tittel">{tittel}</h2>
      </header>
      <div id={id} className={className || "js-content"}>
        {sykepengesoknader.length ? (
          sykepengesoknader.map((soknad, idx) => {
            return <SoknadTeaser key={idx} soknad={soknad} fnr={fnr} />;
          })
        ) : (
          <p className="panel typo-infotekst">{tomListeTekst}</p>
        )}
      </div>
    </div>
  );
};

SoknaderTeasere.propTypes = {
  sykepengesoknader: PropTypes.arrayOf(soknadEllerSykepengesoknad),
  className: PropTypes.string,
  fnr: PropTypes.string,
  tittel: PropTypes.string,
  tomListeTekst: PropTypes.string,
  id: PropTypes.string,
};

export default SoknaderTeasere;
