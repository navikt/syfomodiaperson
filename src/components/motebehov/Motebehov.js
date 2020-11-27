import React, { Component } from "react";
import PropTypes from "prop-types";
import { keyValue, sykmelding as sykmeldingPt } from "@navikt/digisyfo-npm";
import Sidetopp from "../Sidetopp";
import MotebehovKvittering from "./MotebehovKvittering";
import BehandleMotebehovKnapp from "./BehandleMotebehovKnapp";
import UtdragFraSykefravaeret from "./UtdragFraSykefravaeret";
import PrediksjonVisning from "../Prediksjon/PrediksjonVisning";
import { erLokal } from "../../utils/miljoUtil";

export class Motebehov extends Component {
  componentDidMount() {
    const { actions, aktiveDialoger } = this.props;
    aktiveDialoger.forEach((dialog) => {
      if (!dialog.virksomhet.navn) {
        actions.hentVirksomhet(dialog.virksomhet.virksomhetsnummer);
      }
    });
  }

  render() {
    const {
      actions,
      aktiveDialoger,
      fnr,
      ledereData,
      ledereUtenInnsendtMotebehov,
      ledetekster,
      motebehovListe,
      sykmeldt,
      motebehovListeMedJaSvarTilOppgavebehandling,
      veilederinfo,
      oppfolgingstilfelleperioder,
      sykmeldinger,
    } = this.props;
    return (
      <div className="motebehovSide">
        <Sidetopp tittel={"Behov for dialogmøte"} />
        {motebehovListeMedJaSvarTilOppgavebehandling.length > 0 && (
          <BehandleMotebehovKnapp
            actions={actions}
            fnr={fnr}
            motebehovListe={motebehovListeMedJaSvarTilOppgavebehandling}
            veilederinfo={veilederinfo}
          />
        )}
        <MotebehovKvittering
          ledereData={ledereData}
          ledereUtenInnsendtMotebehov={ledereUtenInnsendtMotebehov}
          motebehovListe={motebehovListe}
          sykmeldt={sykmeldt}
        />

        {erLokal() && <PrediksjonVisning fnr={fnr} />}

        <UtdragFraSykefravaeret
          aktiveDialoger={aktiveDialoger}
          fnr={fnr}
          ledetekster={ledetekster}
          oppfolgingstilfelleperioder={oppfolgingstilfelleperioder}
          sykmeldinger={sykmeldinger}
        />
        {motebehovListeMedJaSvarTilOppgavebehandling.length > 0 && (
          <BehandleMotebehovKnapp
            actions={actions}
            fnr={fnr}
            motebehovListe={motebehovListeMedJaSvarTilOppgavebehandling}
            veilederinfo={veilederinfo}
          />
        )}
      </div>
    );
  }
}

Motebehov.propTypes = {
  actions: PropTypes.object,
  aktiveDialoger: PropTypes.arrayOf(PropTypes.object),
  fnr: PropTypes.string,
  ledereData: PropTypes.arrayOf(PropTypes.object),
  ledereUtenInnsendtMotebehov: PropTypes.arrayOf(PropTypes.object),
  ledetekster: keyValue,
  motebehovListe: PropTypes.arrayOf(PropTypes.object),
  sykmeldt: PropTypes.object,
  motebehovListeMedJaSvarTilOppgavebehandling: PropTypes.arrayOf(
    PropTypes.object
  ),
  veilederinfo: PropTypes.object,
  oppfolgingstilfelleperioder: PropTypes.object,
  sykmeldinger: PropTypes.arrayOf(sykmeldingPt),
};

export default Motebehov;
