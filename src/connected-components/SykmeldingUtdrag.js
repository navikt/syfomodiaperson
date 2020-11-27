import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  SykmeldingUtdrag,
  sykmelding as sykmeldingPt,
} from "@navikt/digisyfo-npm";
import { connect } from "react-redux";
import { hentSykmeldinger } from "../actions/sykmeldinger_actions";
import { soknadEllerSykepengesoknad } from "../propTypes";
import { ARBEIDSTAKERE } from "../enums/soknadtyper";

export class Container extends Component {
  componentDidMount() {
    if (this.props.skalHenteSykmeldinger) {
      this.props.hentSykmeldinger(this.props.fnr);
    }
  }

  render() {
    const { sykmelding, soknad } = this.props;
    if (
      sykmelding &&
      soknad &&
      (!soknad.soknadstype || soknad.soknadstype === ARBEIDSTAKERE)
    ) {
      return <SykmeldingUtdrag rootUrl={"/sykefravaer"} {...this.props} />;
    }
    return null;
  }
}

Container.propTypes = {
  hentSykmeldinger: PropTypes.func,
  skalHenteSykmeldinger: PropTypes.bool,
  sykmelding: sykmeldingPt,
  soknad: soknadEllerSykepengesoknad,
  fnr: PropTypes.string,
};

export const mapStateToProps = (state, ownProps) => {
  const skalHenteSykmeldinger =
    !state.sykmeldinger.henter &&
    !state.sykmeldinger.hentet &&
    !state.sykmeldinger.hentingFeilet;
  const sykmelding = state.sykmeldinger.data.find((s) => {
    return s.id === ownProps.soknad.sykmeldingId;
  });

  return {
    ledetekster: state.ledetekster.data,
    skalHenteSykmeldinger,
    sykmelding,
  };
};

export default connect(mapStateToProps, { hentSykmeldinger })(Container);
