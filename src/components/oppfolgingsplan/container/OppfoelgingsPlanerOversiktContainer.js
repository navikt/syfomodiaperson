import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect, useDispatch } from "react-redux";
import Side from "../../../sider/Side";
import * as oppdialogActions from "../../../data/oppfolgingsplan/oppfoelgingsdialoger_actions";
import OppfolgingsplanerOversikt from "../oppfoelgingsdialoger/OppfolgingsplanerOversikt";
import IngenPlaner from "../oppfoelgingsdialoger/IngenPlaner";
import { OPPFOELGINGSPLANER } from "../../../enums/menypunkter";
import { activeOppfolgingsplaner } from "../../../utils/oppfolgingsplanerUtils";
import { harForsoktHentetOppfoelgingsdialoger } from "../../../utils/reducerUtils";
import { hentOppfolgingsplanerLPS } from "../../../data/oppfolgingsplan/oppfolgingsplanerlps_actions";
import { hentPersonOppgaver } from "../../../data/personoppgave/personoppgave_actions";
import SideLaster from "../../SideLaster";

const OppfoelgingsPlanerOversiktSide = ({
  aktiveDialoger,
  inaktiveDialoger,
  personOppgaveList,
  oppfolgingsplanerLPS,
  henter,
  hentingFeilet,
  fnr,
  veilederIdent,
}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(oppdialogActions.hentOppfoelgingsdialoger(fnr));
    dispatch(hentOppfolgingsplanerLPS(fnr));
    dispatch(hentPersonOppgaver(fnr));
  }, []);

  useEffect(() => {
    dispatch(hentOppfolgingsplanerLPS(fnr));
  }, [personOppgaveList]);

  return (
    <Side
      fnr={fnr}
      tittel="Oppfølgingsplaner"
      aktivtMenypunkt={OPPFOELGINGSPLANER}
    >
      <SideLaster henter={henter} hentingFeilet={hentingFeilet}>
        {(() => {
          if (
            aktiveDialoger.length === 0 &&
            inaktiveDialoger.length === 0 &&
            oppfolgingsplanerLPS.length === 0
          ) {
            return <IngenPlaner />;
          }
          return (
            <OppfolgingsplanerOversikt
              aktiveDialoger={aktiveDialoger}
              inaktiveDialoger={inaktiveDialoger}
              oppfolgingsplanerLPS={oppfolgingsplanerLPS}
              fnr={fnr}
              veilederIdent={veilederIdent}
            />
          );
        })()}
      </SideLaster>
    </Side>
  );
};

OppfoelgingsPlanerOversiktSide.propTypes = {
  fnr: PropTypes.string,
  aktiveDialoger: PropTypes.array,
  inaktiveDialoger: PropTypes.array,
  oppfolgingsplanerLPS: PropTypes.array,
  personOppgaveList: PropTypes.array,
  henter: PropTypes.bool,
  hentingFeilet: PropTypes.bool,
  veilederIdent: PropTypes.string,
};

export function mapStateToProps(state) {
  const harForsoktHentetAlt =
    harForsoktHentetOppfoelgingsdialoger(state.oppfoelgingsdialoger) &&
    state.oppfolgingsplanerlps.hentingForsokt &&
    state.personoppgaver.hentingForsokt;
  const henter = !harForsoktHentetAlt;
  const hentingFeilet =
    state.oppfoelgingsdialoger.hentingFeilet ||
    state.oppfolgingsplanerlps.hentingFeilet ||
    state.personoppgaver.hentingFeilet;

  const oppfoelgingsdialoger = state.oppfoelgingsdialoger.data;
  const oppfolgingsplanerLPS = state.oppfolgingsplanerlps.data;

  const personOppgaveList = state.personoppgaver.data;

  const aktiveDialoger = activeOppfolgingsplaner(oppfoelgingsdialoger);

  const inaktiveDialoger = [];
  oppfoelgingsdialoger.forEach((dialog) => {
    if (!aktiveDialoger.includes(dialog)) {
      inaktiveDialoger.push(dialog);
    }
  });

  return {
    brukernavn: state.navbruker.data.navn,
    fnr: state.valgtbruker.personident,
    henter,
    hentingFeilet,
    inaktiveDialoger,
    aktiveDialoger,
    oppfolgingsplanerLPS,
    personOppgaveList,
    veilederIdent: state.veilederinfo.data && state.veilederinfo.data.ident,
  };
}

const OppfoelgingsPlanerOversiktContainer = connect(mapStateToProps)(
  OppfoelgingsPlanerOversiktSide
);
export default OppfoelgingsPlanerOversiktContainer;
