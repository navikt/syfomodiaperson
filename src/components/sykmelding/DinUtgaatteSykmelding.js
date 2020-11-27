import React from "react";
import PropTypes from "prop-types";
import { Utvidbar, keyValue } from "@navikt/digisyfo-npm";
import SykmeldingStatuspanel from "../sykmeldingstatuspanel/SykmeldingStatuspanel";
import DineSykmeldingOpplysninger from "./sykmeldingOpplysninger/DineSykmeldingOpplysninger";

const texts = {
  tittel: "Dine opplysninger",
};

const DinUtgatteSykmelding = ({ sykmelding, ledetekster }) => {
  return (
    <div>
      <SykmeldingStatuspanel sykmelding={sykmelding} />
      <Utvidbar
        className="blokk"
        erApen
        tittel={texts.tittel}
        ikon="svg/doctor-2.svg"
        ikonHover="svg/doctor-2_hover.svg"
        ikonAltTekst="Lege"
        variant="lysebla"
      >
        <DineSykmeldingOpplysninger
          sykmelding={sykmelding}
          ledetekster={ledetekster}
        />
      </Utvidbar>
    </div>
  );
};

DinUtgatteSykmelding.propTypes = {
  ledetekster: keyValue,
  sykmelding: PropTypes.object,
};

export default DinUtgatteSykmelding;
