import React from "react";
import PropTypes from "prop-types";
import { Utvidbar, keyValue } from "@navikt/digisyfo-npm";
import DineSykmeldingOpplysninger from "./sykmeldingOpplysninger/DineSykmeldingOpplysninger";
import SykmeldingStatuspanel from "../sykmeldingstatuspanel/SykmeldingStatuspanel";

const texts = {
  dineOpplysninger: "Dine opplysninger",
};

const DinAvbrutteSykmelding = ({ sykmelding, ledetekster }) => {
  return (
    <div>
      <SykmeldingStatuspanel sykmelding={sykmelding} />
      <Utvidbar
        className="blokk"
        erApen
        tittel={texts.dineOpplysninger}
        ikon="svg/person.svg"
        ikonHover="svg/person_hover.svg"
        ikonAltTekst="Du"
        variant="lysebla"
        Overskrift="H2"
      >
        <DineSykmeldingOpplysninger
          sykmelding={sykmelding}
          ledetekster={ledetekster}
        />
      </Utvidbar>
    </div>
  );
};

DinAvbrutteSykmelding.propTypes = {
  ledetekster: keyValue,
  sykmelding: PropTypes.object,
};

export default DinAvbrutteSykmelding;
