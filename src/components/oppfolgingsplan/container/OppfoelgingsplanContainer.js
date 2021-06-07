import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect, useDispatch } from "react-redux";
import SideFullbredde from "../../../sider/SideFullbredde";
import * as oppdialogActions from "../../../data/oppfolgingsplan/oppfoelgingsdialoger_actions";
import Oppfolgingsplan from "../oppfoelgingsdialoger/Oppfolgingsplan";
import { OPPFOELGINGSPLANER } from "../../../enums/menypunkter";
import { harForsoktHentetOppfoelgingsdialoger } from "../../../utils/reducerUtils";
import SideLaster from "../../SideLaster";

const OppfoelgingsPlanerOversiktSide = ({
  fnr,
  henter,
  hentingFeilet,
  oppfoelgingsdialog,
}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(oppdialogActions.hentOppfoelgingsdialoger(fnr));
  }, []);

  return (
    <SideFullbredde
      fnr={fnr}
      tittel="Oppfølgingsplan"
      aktivtMenypunkt={OPPFOELGINGSPLANER}
    >
      <SideLaster henter={henter} hentingFeilet={hentingFeilet}>
        <Oppfolgingsplan oppfolgingsplan={oppfoelgingsdialog} />
      </SideLaster>
    </SideFullbredde>
  );
};

OppfoelgingsPlanerOversiktSide.propTypes = {
  fnr: PropTypes.string,
  oppfoelgingsdialog: PropTypes.object,
  henter: PropTypes.bool,
  hentingFeilet: PropTypes.bool,
};

export function mapStateToProps(state, ownProps) {
  const id = parseInt(ownProps.match.params.oppfoelgingsdialogId, 10);
  const harForsoktHentetAlt = harForsoktHentetOppfoelgingsdialoger(
    state.oppfoelgingsdialoger
  );
  const henter = !harForsoktHentetAlt || state.veilederinfo.henter;
  const hentingFeilet = state.oppfoelgingsdialoger.hentingFeilet;

  const oppfoelgingsdialog = state.oppfoelgingsdialoger.data.filter(
    (dialog) => {
      return dialog.id === id;
    }
  )[0];
  return {
    brukernavn: state.navbruker.data.navn,
    oppfoelgingsdialog,
    fnr: state.valgtbruker.personident,
    henter,
    hentingFeilet,
  };
}

const OppfoelgingsPlanerOversiktContainer = connect(mapStateToProps)(
  OppfoelgingsPlanerOversiktSide
);
export default OppfoelgingsPlanerOversiktContainer;
