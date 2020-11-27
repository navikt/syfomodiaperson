import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { keyValue, sykmelding as sykmeldingPt } from "@navikt/digisyfo-npm";
import Side from "../sider/Side";
import Feilmelding from "../components/Feilmelding";
import AppSpinner from "../components/AppSpinner";
import * as motebehovActions from "../actions/motebehov_actions";
import * as oppfoelgingsdialogerActions from "../actions/oppfoelgingsdialoger_actions";
import * as oppfolgingstilfelleperioderActions from "../actions/oppfolgingstilfelleperioder_actions";
import * as sykmeldingerActions from "../actions/sykmeldinger_actions";
import * as ledereActions from "../actions/ledere_actions";
import * as virksomhetActions from "../actions/virksomhet_actions";
import * as behandleMotebehovActions from "../actions/behandlemotebehov_actions";
import { MOETEPLANLEGGER } from "../enums/menypunkter";
import { hentBegrunnelseTekst } from "../utils/tilgangUtils";
import {
  sorterMotebehovDataEtterDato,
  finnNyesteMotebehovsvarFraHverDeltaker,
  motebehovlisteMedKunJaSvar,
} from "../utils/motebehovUtils";
import {
  harForsoktHentetLedere,
  harForsoktHentetLedetekster,
  harForsoktHentetMotebehov,
  harForsoktHentetOppfoelgingsdialoger,
} from "../utils/reducerUtils";
import { ledereUtenMotebehovsvar } from "../utils/ledereUtils";
import Motebehov from "../components/motebehov/Motebehov";

const texts = {
  feilmelding: "Du har ikke tilgang til denne tjenesten",
};

export class MotebehovSide extends Component {
  componentDidMount() {
    const { actions, fnr } = this.props;
    actions.hentLedere(fnr);
    actions.hentSykmeldinger(fnr);
    actions.hentMotebehov(fnr);
  }

  componentWillReceiveProps(nextProps) {
    const { actions, fnr } = nextProps;
    actions.hentOppfolgingstilfelleperioder(fnr);
    if (fnr) {
      actions.hentOppfoelgingsdialoger(fnr);
    }
  }

  render() {
    const {
      actions,
      aktiveDialoger,
      fnr,
      henter,
      hentingFeilet,
      ledereData,
      ledereUtenInnsendtMotebehov,
      ledetekster,
      motebehovListeUtenFlereSvarFraSammePerson,
      motebehovTilgang,
      sykmeldt,
      tilgang,
      motebehovListeMedJaSvarTilOppgavebehandling,
      veilederinfo,
      oppfolgingstilfelleperioder,
      sykmeldinger,
    } = this.props;
    return (
      <Side fnr={fnr} tittel="Møtebehov" aktivtMenypunkt={MOETEPLANLEGGER}>
        {(() => {
          if (henter) {
            return <AppSpinner />;
          }
          if (!tilgang.harTilgang) {
            return (
              <Feilmelding
                tittel={texts.feilmelding}
                melding={hentBegrunnelseTekst(tilgang.begrunnelse)}
              />
            );
          }
          if (motebehovTilgang.harTilgang === false) {
            return (
              <Feilmelding
                tittel={texts.feilmelding}
                melding={hentBegrunnelseTekst(motebehovTilgang.begrunnelse)}
              />
            );
          }
          if (hentingFeilet) {
            return <Feilmelding />;
          }
          return (
            <Motebehov
              actions={actions}
              fnr={fnr}
              ledereData={ledereData}
              ledereUtenInnsendtMotebehov={ledereUtenInnsendtMotebehov}
              ledetekster={ledetekster}
              motebehovListe={motebehovListeUtenFlereSvarFraSammePerson}
              sykmeldt={sykmeldt}
              motebehovListeMedJaSvarTilOppgavebehandling={
                motebehovListeMedJaSvarTilOppgavebehandling
              }
              veilederinfo={veilederinfo}
              aktiveDialoger={aktiveDialoger}
              oppfolgingstilfelleperioder={oppfolgingstilfelleperioder}
              sykmeldinger={sykmeldinger}
            />
          );
        })()}
      </Side>
    );
  }
}

MotebehovSide.propTypes = {
  actions: PropTypes.object,
  aktiveDialoger: PropTypes.array,
  fnr: PropTypes.string,
  henter: PropTypes.bool,
  hentingFeilet: PropTypes.bool,
  ledereData: PropTypes.arrayOf(PropTypes.object),
  ledereUtenInnsendtMotebehov: PropTypes.arrayOf(PropTypes.object),
  ledetekster: keyValue,
  motebehovListeUtenFlereSvarFraSammePerson: PropTypes.arrayOf(
    PropTypes.object
  ),
  motebehovTilgang: PropTypes.object,
  sykmeldt: PropTypes.object,
  tilgang: PropTypes.object,
  motebehovListeMedJaSvarTilOppgavebehandling: PropTypes.arrayOf(
    PropTypes.object
  ),
  veilederinfo: PropTypes.object,
  oppfolgingstilfelleperioder: PropTypes.object,
  sykmeldinger: PropTypes.arrayOf(sykmeldingPt),
};

export function mapDispatchToProps(dispatch) {
  const actions = Object.assign(
    {},
    motebehovActions,
    oppfoelgingsdialogerActions,
    oppfolgingstilfelleperioderActions,
    sykmeldingerActions,
    ledereActions,
    virksomhetActions,
    behandleMotebehovActions
  );
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}

export const mapStateToProps = (state, ownProps) => {
  const motebehovData = state.motebehov.data;
  const sortertMotebehovListe = motebehovData.sort(
    sorterMotebehovDataEtterDato
  );
  const motebehovListeUtenFlereSvarFraSammePerson = finnNyesteMotebehovsvarFraHverDeltaker(
    sortertMotebehovListe
  );

  const motebehovListeMedJaSvarTilOppgavebehandling = motebehovlisteMedKunJaSvar(
    motebehovData
  );

  const ledereData = state.ledere.data;
  const oppfolgingstilfelleperioder = state.oppfolgingstilfelleperioder;
  const ledereUtenInnsendtMotebehov = ledereUtenMotebehovsvar(
    ledereData,
    motebehovData,
    oppfolgingstilfelleperioder
  );

  const aktiveDialoger = state.oppfoelgingsdialoger.data.filter((dialog) => {
    return (
      dialog.status !== "AVBRUTT" &&
      new Date(dialog.godkjentPlan.gyldighetstidspunkt.tom) > new Date()
    );
  });

  const harForsoktHentetAlt =
    harForsoktHentetMotebehov(state.motebehov) &&
    harForsoktHentetLedetekster(state.ledetekster) &&
    harForsoktHentetOppfoelgingsdialoger(state.oppfoelgingsdialoger) &&
    harForsoktHentetLedere(state.ledere);
  return {
    fnr: ownProps.params.fnr,
    henter: !harForsoktHentetAlt,
    hentingFeilet:
      state.motebehov.hentingFeilet || state.ledetekster.hentingFeilet,
    ledereData,
    ledereUtenInnsendtMotebehov,
    ledetekster: state.ledetekster.data,
    motebehovListeUtenFlereSvarFraSammePerson,
    motebehovTilgang: state.motebehov.tilgang,
    sykmeldt: state.navbruker.data,
    tilgang: state.tilgang.data,
    motebehovListeMedJaSvarTilOppgavebehandling,
    veilederinfo: state.veilederinfo.data,
    aktiveDialoger,
    oppfolgingstilfelleperioder,
    sykmeldinger: state.sykmeldinger.data,
  };
};

const MotebehovContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(MotebehovSide);

export default MotebehovContainer;
