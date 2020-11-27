import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Side from "../sider/Side";
import SidetoppSpeilet from "../components/SidetoppSpeilet";
import * as actionCreators from "../actions/sykmeldinger_actions";
import Feilmelding from "../components/Feilmelding";
import AppSpinner from "../components/AppSpinner";
import DineSykmeldinger from "../components/sykmeldinger/DineSykmeldinger";
import Brodsmuler from "../components/Brodsmuler";
import { SYKMELDINGER } from "../enums/menypunkter";
import Speilingvarsel from "../components/Speilingvarsel";
import { hentBegrunnelseTekst } from "../utils/tilgangUtils";
import { harForsoktHentetSykmeldinger } from "../utils/reducerUtils";
import Pengestopp from "../components/pengestopp/Pengestopp";

const texts = {
  introduksjonstekst:
    "NAV mottar alle sykmeldinger. Ser du den ikke her? Det betyr at den som har sykmeldt deg ikke sender den digitalt til NAV. Da bruker du papirsykmeldingen i stedet.",
  feilmelding: "Du har ikke tilgang til denne tjenesten",
};

export class SykmeldingerSide extends Component {
  componentDidMount() {
    const { actions, fnr } = this.props;
    actions.hentSykmeldinger(fnr);
  }

  render() {
    const {
      brukernavn,
      fnr,
      henter,
      hentingFeilet,
      sortering,
      sykmeldinger,
      tilgang,
    } = this.props;
    const htmlIntro = {
      __html: `<p>${texts.introduksjonstekst}</p>`,
    };
    const brodsmuler = [
      {
        tittel: "Ditt sykefravær",
      },
      {
        tittel: "Dine sykmeldinger",
      },
    ];

    return (
      <Side fnr={fnr} tittel="Sykmeldinger" aktivtMenypunkt={SYKMELDINGER}>
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
              <Pengestopp sykmeldinger={sykmeldinger} />
              <Speilingvarsel brukernavn={brukernavn} />
              <div className="speiling">
                <Brodsmuler brodsmuler={brodsmuler} />
                <SidetoppSpeilet
                  tittel="Dine sykmeldinger"
                  htmlTekst={htmlIntro}
                />
                <DineSykmeldinger
                  fnr={fnr}
                  sykmeldinger={sykmeldinger}
                  sortering={sortering}
                />
              </div>
            </div>
          );
        })()}
      </Side>
    );
  }
}

SykmeldingerSide.propTypes = {
  fnr: PropTypes.string,
  brukernavn: PropTypes.string,
  actions: PropTypes.object,
  sykmeldinger: PropTypes.array,
  henter: PropTypes.bool,
  hentingFeilet: PropTypes.bool,
  tilgang: PropTypes.object,
  sortering: PropTypes.shape(),
};

export function mapDispatchToProps(dispatch) {
  const actions = Object.assign({}, actionCreators);
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}

export function mapStateToProps(state, ownProps) {
  const harForsoektHentetAlt = harForsoktHentetSykmeldinger(state.sykmeldinger);
  const henter =
    !harForsoektHentetAlt || state.ledetekster.henter || state.tilgang.henter;
  const hentingFeilet =
    state.sykmeldinger.hentingFeilet ||
    state.ledetekster.hentingFeilet ||
    state.tilgang.hentingFeilet;
  return {
    brukernavn: state.navbruker.data.navn,
    fnr: ownProps.params.fnr,
    henter,
    hentingFeilet,
    ledetekster: state.ledetekster.data,
    sykmeldinger: state.sykmeldinger.data,
    tilgang: state.tilgang.data,
    sortering: state.sykmeldinger.sortering,
  };
}

const SykmeldingerContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SykmeldingerSide);
export default SykmeldingerContainer;
