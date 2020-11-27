import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { keyValue, sykmelding as sykmeldingPt } from "@navikt/digisyfo-npm";
import Side from "../sider/Side";
import * as soknaderActions from "../actions/soknader_actions";
import * as sykmeldingerActions from "../actions/sykmeldinger_actions";
import Feilmelding from "../components/Feilmelding";
import AppSpinner from "../components/AppSpinner";
import { SYKEPENGESOKNADER } from "../enums/menypunkter";
import { soknad as soknadPt } from "../propTypes";
import { hentBegrunnelseTekst } from "../utils/tilgangUtils";
import {
  ARBEIDSTAKERE,
  OPPHOLD_UTLAND,
  SELVSTENDIGE_OG_FRILANSERE,
  ARBEIDSLEDIG,
  BEHANDLINGSDAGER,
  ANNET_ARBEIDSFORHOLD,
} from "../enums/soknadtyper";
import SykepengesoknadSelvstendig from "../components/soknad-selvstendig/SykepengesoknadSelvstendig";
import SykepengesoknadUtland from "../components/soknad-utland/SykepengesoknadUtland";
import SendtSoknadArbeidstakerNy from "../components/soknad-arbeidstaker-ny/SendtSoknadArbeidstakerNy";
import { AVBRUTT, KORRIGERT, SENDT } from "../enums/soknadstatuser";
import IkkeInnsendtSoknad from "../components/soknad-felles/IkkeInnsendtSoknad";
import AvbruttSoknadArbeidtakerNy from "../components/soknad-arbeidstaker-ny/AvbruttSoknadArbeidtakerNy";
import SykepengesoknadBehandlingsdager from "../components/soknad-behandlingsdager/SykepengesoknadBehandlingsdager";
import {
  harForsoktHentetSoknader,
  harForsoktHentetSykmeldinger,
} from "../utils/reducerUtils";

const texts = {
  feilmedling: "Du har ikke itllgang til denne tjenesten",
};

export class Container extends Component {
  componentDidMount() {
    const { actions, fnr } = this.props;
    actions.hentSykmeldinger(fnr);
    actions.hentSoknader(fnr);
  }

  render() {
    const {
      brukernavn,
      henter,
      hentingFeilet,
      tilgang,
      soknad,
      fnr,
      sykmelding,
    } = this.props;
    const brodsmuler = [
      {
        tittel: "Ditt sykefravær",
      },
      {
        tittel: "Søknad om sykepenger",
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
                tittel={texts.feilmedling}
                melding={hentBegrunnelseTekst(tilgang.begrunnelse)}
              />
            );
          }
          if (hentingFeilet) {
            return <Feilmelding />;
          }
          if (
            soknad &&
            (soknad.soknadstype === SELVSTENDIGE_OG_FRILANSERE ||
              soknad.soknadstype === ARBEIDSLEDIG ||
              soknad.soknadstype === ANNET_ARBEIDSFORHOLD)
          ) {
            return (
              <SykepengesoknadSelvstendig
                fnr={fnr}
                brodsmuler={brodsmuler}
                brukernavn={brukernavn}
                sykmelding={sykmelding}
                soknad={soknad}
              />
            );
          }
          if (soknad && soknad.soknadstype === OPPHOLD_UTLAND) {
            return (
              <SykepengesoknadUtland
                fnr={fnr}
                brodsmuler={brodsmuler}
                brukernavn={brukernavn}
                soknad={soknad}
              />
            );
          }
          if (soknad && soknad.soknadstype === ARBEIDSTAKERE) {
            return soknad.status === SENDT || soknad.status === KORRIGERT ? (
              <SendtSoknadArbeidstakerNy
                fnr={fnr}
                brodsmuler={brodsmuler}
                brukernavn={brukernavn}
                soknad={soknad}
              />
            ) : soknad.status === AVBRUTT ? (
              <AvbruttSoknadArbeidtakerNy
                fnr={fnr}
                brodsmuler={brodsmuler}
                brukernavn={brukernavn}
                soknad={soknad}
              />
            ) : (
              <IkkeInnsendtSoknad fnr={fnr} />
            );
          }
          if (soknad && soknad.soknadstype === BEHANDLINGSDAGER) {
            return (
              <SykepengesoknadBehandlingsdager
                fnr={fnr}
                brodsmuler={brodsmuler}
                brukernavn={brukernavn}
                soknad={soknad}
              />
            );
          }
          return <Feilmelding />;
        })()}
      </Side>
    );
  }
}

Container.propTypes = {
  fnr: PropTypes.string,
  brukernavn: PropTypes.string,
  actions: PropTypes.object,
  henter: PropTypes.bool,
  hentingFeilet: PropTypes.bool,
  tilgang: PropTypes.object,
  ledetekster: keyValue,
  soknad: soknadPt,
  sykmelding: sykmeldingPt,
};

export function mapDispatchToProps(dispatch) {
  const actions = Object.assign({}, soknaderActions, sykmeldingerActions);
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}

export function mapStateToProps(state, ownProps) {
  const harForsoktHentetAlt =
    harForsoktHentetSykmeldinger(state.sykmeldinger) &&
    harForsoktHentetSoknader(state.soknader);
  const henter =
    !harForsoktHentetAlt || state.ledetekster.henter || state.tilgang.henter;
  const hentingFeilet =
    state.ledetekster.hentingFeilet || state.tilgang.hentingFeilet;
  const soknad = state.soknader.data.find((s) => {
    return s.id === ownProps.params.sykepengesoknadId;
  });
  const sykmelding = state.sykmeldinger.data.find((sykmld) => {
    return soknad ? sykmld.id === soknad.sykmeldingId : false;
  });

  return {
    brukernavn: state.navbruker.data.navn,
    fnr: ownProps.params.fnr,
    henter,
    hentingFeilet,
    ledetekster: state.ledetekster.data,
    tilgang: state.tilgang.data,
    soknad,
    sykmelding,
  };
}

const SykepengesoknadContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Container);
export default SykepengesoknadContainer;
