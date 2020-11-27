import React from "react";
import PropTypes from "prop-types";
import { keyValue } from "@navikt/digisyfo-npm";
import SykmeldingTeaser from "./SykmeldingTeaser";

const SykmeldingTeasere = ({
  sykmeldinger,
  ledetekster,
  fnr,
  className,
  tittel = "",
  ingenSykmeldingerMelding,
  id,
  children,
}) => {
  return (
    <div className="blokk--l">
      <header className="inngangspanelerHeader">
        <h2 className="inngangspanelerHeader__tittel">{tittel}</h2>
        {children}
      </header>
      <div id={id} className={className || "js-content"}>
        {sykmeldinger.length ? (
          sykmeldinger.map((sykmelding, idx) => {
            return (
              <SykmeldingTeaser
                key={idx}
                fnr={fnr}
                sykmelding={sykmelding}
                ledetekster={ledetekster}
              />
            );
          })
        ) : (
          <p className="panel typo-infotekst">{ingenSykmeldingerMelding}</p>
        )}
      </div>
    </div>
  );
};

SykmeldingTeasere.propTypes = {
  sykmeldinger: PropTypes.array,
  ledetekster: keyValue,
  className: PropTypes.string,
  tittel: PropTypes.string,
  fnr: PropTypes.string,
  ingenSykmeldingerMelding: PropTypes.string,
  id: PropTypes.string,
  children: PropTypes.element,
};

export default SykmeldingTeasere;
