import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect, useDispatch } from "react-redux";
import SideFullbredde from "../sider/SideFullbredde";
import * as oppdialogActions from "../actions/oppfoelgingsdialoger_actions";
import Feilmelding from "../components/Feilmelding";
import Oppfoelgingsplan from "../components/oppfoelgingsdialoger/Oppfoelgingsplan";
import AppSpinner from "../components/AppSpinner";
import { OPPFOELGINGSPLANER } from "../enums/menypunkter";
import { hentBegrunnelseTekst } from "../utils/tilgangUtils";
import { harForsoktHentetOppfoelgingsdialoger } from "../utils/reducerUtils";

const texts = {
  errorTitle: "Du har ikke tilgang til denne tjenesten",
};

const OppfoelgingsPlanerOversiktSide = ({
  fnr,
  henter,
  hentingFeilet,
  oppfoelgingsdialog,
  tilgang,
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
      {(() => {
        if (henter) {
          return <AppSpinner />;
        }
        if (!tilgang.harTilgang) {
          return (
            <Feilmelding
              tittel={texts.errorTitle}
              melding={hentBegrunnelseTekst(tilgang.begrunnelse)}
            />
          );
        }
        if (hentingFeilet) {
          return <Feilmelding />;
        }
        return (
          <Oppfoelgingsplan oppfoelgingsdialog={oppfoelgingsdialog} fnr={fnr} />
        );
      })()}
    </SideFullbredde>
  );
};

OppfoelgingsPlanerOversiktSide.propTypes = {
  fnr: PropTypes.string,
  oppfoelgingsdialog: PropTypes.object,
  henter: PropTypes.bool,
  hentingFeilet: PropTypes.bool,
  tilgang: PropTypes.object,
};

export function mapStateToProps(state, ownProps) {
  const id = parseInt(ownProps.params.oppfoelgingsdialogId, 10);
  const harForsoktHentetAlt = harForsoktHentetOppfoelgingsdialoger(
    state.oppfoelgingsdialoger
  );
  const henter =
    !harForsoktHentetAlt || state.tilgang.henter || state.veilederinfo.henter;
  const hentingFeilet =
    state.oppfoelgingsdialoger.hentingFeilet || state.tilgang.hentingFeilet;

  const oppfoelgingsdialog = state.oppfoelgingsdialoger.data.filter(
    (dialog) => {
      return dialog.id === id;
    }
  )[0];
  return {
    brukernavn: state.navbruker.data.navn,
    oppfoelgingsdialog,
    fnr: ownProps.params.fnr,
    henter,
    hentingFeilet,
    tilgang: state.tilgang.data,
  };
}

const OppfoelgingsPlanerOversiktContainer = connect(mapStateToProps)(
  OppfoelgingsPlanerOversiktSide
);
export default OppfoelgingsPlanerOversiktContainer;
