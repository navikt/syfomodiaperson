import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Side from "../sider/Side";
import * as soknaderActions from "../actions/soknader_actions";
import Feilmelding from "../components/Feilmelding";
import AppSpinner from "../components/AppSpinner";
import Soknader from "../components/soknader/Soknader";
import Brodsmuler from "../components/Brodsmuler";
import { SYKEPENGESOKNADER } from "../enums/menypunkter";
import { soknad as soknadPt } from "../propTypes";
import Speilingvarsel from "../components/Speilingvarsel";
import { hentBegrunnelseTekst } from "../utils/tilgangUtils";
import Feilstripe from "../components/Feilstripe";
import { harForsoktHentetSoknader } from "../utils/reducerUtils";

const texts = {
  feilmelding: "Du har ikke tilgang til denne tjenesten",
};

export class SykepengesoknaderSide extends Component {
  componentDidMount() {
    const { actions, fnr } = this.props;
    actions.hentSoknader(fnr);
  }

  render() {
    const {
      brukernavn,
      henter,
      hentingFeilet,
      hentingFeiletSoknader,
      tilgang,
      fnr,
      soknader,
    } = this.props;
    const brodsmuler = [
      {
        tittel: "Ditt sykefravær",
      },
      {
        tittel: "Søknader om sykepenger",
      },
    ];

    return (
      <Side
        fnr={fnr}
        tittel="Sykepengesøknader"
        aktivtMenypunkt={SYKEPENGESOKNADER}
      >
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
          if (hentingFeilet) {
            return <Feilmelding />;
          }
          return (
            <div>
              <Feilstripe
                className="blokk--s"
                tekst={`Beklager – vi kunne ikke hente alle sykepengesøknadene til ${brukernavn}`}
                vis={hentingFeiletSoknader}
              />
              <Speilingvarsel brukernavn={brukernavn} />
              <div className="speiling">
                <Brodsmuler brodsmuler={brodsmuler} />
                <Soknader soknader={soknader} fnr={fnr} />
              </div>
            </div>
          );
        })()}
      </Side>
    );
  }
}

SykepengesoknaderSide.propTypes = {
  fnr: PropTypes.string,
  brukernavn: PropTypes.string,
  actions: PropTypes.object,
  henter: PropTypes.bool,
  hentingFeilet: PropTypes.bool,
  tilgang: PropTypes.object,
  hentingFeiletSoknader: PropTypes.bool,
  soknader: PropTypes.arrayOf(soknadPt),
};

export function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Object.assign({}, soknaderActions), dispatch),
  };
}

export function mapStateToProps(state, ownProps) {
  const harForsoktHentetAlt = harForsoktHentetSoknader(state.soknader);
  const henter =
    !harForsoktHentetAlt || state.ledetekster.henter || state.tilgang.henter;
  const hentingFeilet =
    state.ledetekster.hentingFeilet || state.tilgang.hentingFeilet;
  const hentingFeiletSoknader = state.soknader.hentingFeilet;

  return {
    brukernavn: state.navbruker.data.navn,
    fnr: ownProps.params.fnr,
    henter,
    hentingFeilet: hentingFeilet || hentingFeiletSoknader,
    hentingFeiletSoknader,
    ledetekster: state.ledetekster.data,
    soknader: state.soknader.data,
    tilgang: state.tilgang.data,
  };
}

const SykepengesoknaderContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SykepengesoknaderSide);
export default SykepengesoknaderContainer;
