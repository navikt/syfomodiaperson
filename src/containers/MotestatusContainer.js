import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as moteActions from "../actions/moter_actions";
import MotebookingStatus from "../mote/components/MotebookingStatus";

export class MotebookingStatusWrapper extends Component {
  render() {
    const { henter } = this.props;
    if (henter) {
      return null;
    }

    return <MotebookingStatus {...this.props} />;
  }
}

MotebookingStatusWrapper.propTypes = {
  henter: PropTypes.bool,
  fnr: PropTypes.string,
};

export const mapStateToProps = (state, ownProps) => {
  const moteUuid = ownProps.moteUuid;
  let aktivtMote = state.moter.data.filter((m) => {
    return m.moteUuid === moteUuid;
  })[0];
  const aktoer =
    aktivtMote &&
    aktivtMote.deltakere.filter((deltaker) => {
      return deltaker.type === "Bruker";
    })[0];
  const reservert =
    state.navbruker.data.kontaktinfo &&
    !state.navbruker.data.kontaktinfo.skalHaVarsel;
  if (aktoer && !aktoer.svartidspunkt && reservert) {
    aktivtMote = Object.assign({}, aktivtMote, {
      deltakere: aktivtMote.deltakere.filter((deltaker) => {
        return deltaker.type !== "Bruker";
      }),
    });
  }
  aktivtMote = Object.assign({}, aktivtMote, {
    deltakere:
      aktivtMote &&
      aktivtMote.deltakere
        .sort((d1, d2) => {
          return d2.type.toLowerCase().localeCompare(d1.type.toLowerCase());
        })
        .map((deltaker) => {
          return Object.assign({}, deltaker, {
            svar: deltaker.svar.sort((a1, a2) => {
              return new Date(a2.tid).getTime() <= new Date(a1.tid).getTime()
                ? 1
                : -1;
            }),
          });
        }),
    alternativer:
      aktivtMote &&
      aktivtMote.alternativer.sort((a1, a2) => {
        return new Date(a2.tid).getTime() <= new Date(a1.tid).getTime()
          ? 1
          : -1;
      }),
  });

  return {
    fnr: ownProps.fnr,
    mote: aktivtMote,
    avbrytFeilet: state.moter.avbrytFeilet,
    avbryter: state.moter.avbryter,
    henter:
      state.moter.henter || state.navbruker.henter || state.ledetekster.henter,
    ledetekster: state.ledetekster.data,
    arbeidstaker: state.navbruker.data,
    antallNyeTidspunkt: state.moter.antallNyeTidspunkt,
    nyeAlternativFeilet: state.moter.nyeAlternativFeilet,
    senderNyeAlternativ: state.moter.senderNyeAlternativ,
    skalViseFlereAlternativ: state.moter.skalViseFlereAlternativ,
  };
};

const MotestatusContainer = connect(
  mapStateToProps,
  Object.assign({}, moteActions)
)(MotebookingStatusWrapper);

export default MotestatusContainer;
