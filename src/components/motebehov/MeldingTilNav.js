import React from "react";
import PropTypes from "prop-types";
import { Checkbox } from "nav-frontend-skjema";
import { erMeldingTilNavInformasjon } from "../../utils/sykmeldinger/sykmeldingUtils";

const tekster = {
  meldingTilNav: {
    header: "Melding til NAV",
    navBoerTaTakISaken: {
      tittel: "Ønskes bistand fra NAV nå?",
      begrunnelseTittel: "Begrunn nærmere",
    },
  },
};

export const MeldingTilNav = ({ sykmelding }) => {
  const meldingTilNav = sykmelding.meldingTilNav;
  const skalVise = erMeldingTilNavInformasjon(sykmelding);
  return (
    skalVise && (
      <div className="sykmeldingMotebehovVisning__avsnitt">
        <h5 className="undertittel">{tekster.meldingTilNav.header}</h5>

        <Checkbox
          className="sykmeldingMotebehovVisning__checkbox"
          label={tekster.meldingTilNav.navBoerTaTakISaken.tittel}
          checked={meldingTilNav.navBoerTaTakISaken}
          disabled
        />
        {meldingTilNav.navBoerTaTakISakenBegrunnelse && [
          <h6 key={0} className="sporsmal">
            {tekster.meldingTilNav.navBoerTaTakISaken.begrunnelseTittel}
          </h6>,
          <p key={1}>{meldingTilNav.navBoerTaTakISakenBegrunnelse}</p>,
        ]}
      </div>
    )
  );
};

MeldingTilNav.propTypes = {
  sykmelding: PropTypes.object,
};

export default MeldingTilNav;
