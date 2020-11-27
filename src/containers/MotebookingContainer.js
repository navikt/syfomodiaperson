import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Side from "../sider/Side";
import MotebookingSkjemaContainer from "./MotebookingSkjemaContainer";
import MotestatusContainer from "./MotestatusContainer";
import Feilmelding from "../components/Feilmelding";
import AppSpinner from "../components/AppSpinner";
import * as moterActions from "../actions/moter_actions";
import { MOETEPLANLEGGER } from "../enums/menypunkter";
import { hentBegrunnelseTekst } from "../utils/tilgangUtils";

const texts = {
  pageTitle: "Møteplanlegger",
  errorTitle: "Du har ikke tilgang til denne tjenesten",
};

export class MotebookingSide extends Component {
  componentDidMount() {
    this.props.hentMoter(this.props.fnr);
  }

  render() {
    const {
      fnr,
      henter,
      hentingFeilet,
      mote,
      tilgang,
      moterTilgang,
    } = this.props;
    return (
      <Side
        fnr={fnr}
        tittel={texts.pageTitle}
        aktivtMenypunkt={MOETEPLANLEGGER}
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
          if (moterTilgang.harTilgang === false) {
            return (
              <Feilmelding
                tittel={texts.errorTitle}
                melding={hentBegrunnelseTekst(moterTilgang.begrunnelse)}
              />
            );
          }
          if (mote) {
            return <MotestatusContainer fnr={fnr} moteUuid={mote.moteUuid} />;
          }
          return <MotebookingSkjemaContainer {...this.props} />;
        })()}
      </Side>
    );
  }
}

MotebookingSide.propTypes = {
  fnr: PropTypes.string,
  mote: PropTypes.object,
  tilgang: PropTypes.object,
  virksomhet: PropTypes.object,
  hentMoter: PropTypes.func,
  hentLedere: PropTypes.func,
  nullstillVirksomhet: PropTypes.func,
  hentVirksomhet: PropTypes.func,
  henter: PropTypes.bool,
  hentingFeilet: PropTypes.bool,
  hentLedereFeiletBool: PropTypes.bool,
  avbryter: PropTypes.bool,
  avbrytFeilet: PropTypes.bool,
  moterTilgang: PropTypes.object,
};

export const mapStateToProps = (state, ownProps) => {
  const aktivtMote = state.moter.data.filter((mote) => {
    return mote.status !== "AVBRUTT";
  })[0];

  const harForsoktHentetAlt = state.moter.hentingForsokt;
  return {
    fnr: ownProps.params.fnr,
    mote: aktivtMote,
    henter: !harForsoktHentetAlt || state.ledere.henter || state.tilgang.henter,
    sender: state.moter.sender,
    hentingFeilet:
      state.moter.hentingFeilet ||
      state.tilgang.hentingFeilet ||
      state.ledere.hentingFeilet,
    sendingFeilet: state.moter.sendingFeilet,
    tilgang: state.tilgang.data,
    moterTilgang: state.moter.tilgang,
  };
};

const MotebookingContainer = connect(
  mapStateToProps,
  moterActions
)(MotebookingSide);

export default MotebookingContainer;
