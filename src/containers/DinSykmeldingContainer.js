import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  getSykmelding,
  sykmeldingstatuser,
  keyValue,
} from "@navikt/digisyfo-npm";
import Side from "../sider/Side";
import SidetoppSpeilet from "../components/SidetoppSpeilet";
import * as sykmeldingerActions from "../actions/sykmeldinger_actions";
import SykmeldingSide from "../components/sykmelding/SykmeldingSide";
import Feilmelding from "../components/Feilmelding";
import AppSpinner from "../components/AppSpinner";
import Brodsmuler from "../components/Brodsmuler";
import Speilingvarsel from "../components/Speilingvarsel";
import { SYKMELDINGER } from "../enums/menypunkter";
import { hentBegrunnelseTekst } from "../utils/tilgangUtils";
import { ARBEIDSTAKER } from "../enums/arbeidssituasjoner";
import { harForsoktHentetSykmeldinger } from "../utils/reducerUtils";

const texts = {
  pageTitleSykmelding: "Sykmelding",
  pageTitleEgenmelding: "Egenmelding",
  feilmelding: "Du har ikke tilgang til denne tjenesten",
};

const pageTitle = (dinSykmelding) => {
  return dinSykmelding.egenmeldt
    ? texts.pageTitleEgenmelding
    : texts.pageTitleSykmelding;
};

export class DinSykmeldingSide extends Component {
  componentDidMount() {
    const { actions, fnr } = this.props;
    actions.hentSykmeldinger(fnr);
  }

  render() {
    const {
      ledetekster,
      arbeidsgiversSykmelding,
      brukernavn,
      fnr,
      dinSykmelding,
      henter,
      hentingFeilet,
      tilgang,
    } = this.props;

    const brodsmuler = [
      {
        tittel: "Ditt sykefravær",
      },
      {
        tittel: "Dine sykmeldinger",
      },
      {
        tittel: "Sykmelding",
      },
    ];

    return (
      <Side fnr={fnr} tittel="Sykmeldinger" aktivtMenypunkt={SYKMELDINGER}>
        {(() => {
          if (henter) {
            return <AppSpinner />;
          }
          if (hentingFeilet) {
            return <Feilmelding />;
          }
          if (!tilgang.harTilgang) {
            return (
              <Feilmelding
                tittel={texts.feilmelding}
                melding={hentBegrunnelseTekst(tilgang.begrunnelse)}
              />
            );
          }

          return (
            <div>
              <Speilingvarsel brukernavn={brukernavn} />
              <div className="speiling">
                <Brodsmuler brodsmuler={brodsmuler} />
                <SidetoppSpeilet tittel={pageTitle(dinSykmelding)} />
                <SykmeldingSide
                  dinSykmelding={dinSykmelding}
                  ledetekster={ledetekster}
                  arbeidsgiversSykmelding={arbeidsgiversSykmelding}
                  fnr={fnr}
                />
              </div>
            </div>
          );
        })()}
      </Side>
    );
  }
}

DinSykmeldingSide.propTypes = {
  fnr: PropTypes.string,
  brukernavn: PropTypes.string,
  actions: PropTypes.object,
  henter: PropTypes.bool,
  hentingFeilet: PropTypes.bool,
  tilgang: PropTypes.object,
  ledetekster: keyValue,
  dinSykmelding: PropTypes.object,
  arbeidsgiversSykmelding: PropTypes.object,
};

export function mapDispatchToProps(dispatch) {
  const actions = Object.assign({}, sykmeldingerActions);
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}

export function mapStateToProps(state, ownProps) {
  const sykmeldingId = ownProps.params.sykmeldingId;
  const harForsoktHentetAlt = harForsoktHentetSykmeldinger(state.sykmeldinger);
  const henter = !harForsoktHentetAlt || state.ledetekster.henter;
  const hentingFeilet =
    state.sykmeldinger.hentingFeilet || state.tilgang.hentingFeilet;
  const dinSykmelding = getSykmelding(state.sykmeldinger.data, sykmeldingId);
  let arbeidsgiversSykmelding = {};

  if (
    dinSykmelding &&
    (dinSykmelding.status === sykmeldingstatuser.SENDT ||
      (dinSykmelding.status === sykmeldingstatuser.BEKREFTET &&
        dinSykmelding.valgtArbeidssituasjon === ARBEIDSTAKER))
  ) {
    arbeidsgiversSykmelding = getSykmelding(
      state.sykmeldinger.arbeidsgiverssykmeldinger,
      sykmeldingId
    );
  }

  return {
    brukernavn: state.navbruker.data.navn,
    fnr: ownProps.params.fnr,
    henter,
    hentingFeilet,
    tilgang: state.tilgang.data,
    ledetekster: state.ledetekster.data,
    dinSykmelding,
    arbeidsgiversSykmelding,
  };
}

const DinSykmeldingContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DinSykmeldingSide);
export default DinSykmeldingContainer;
