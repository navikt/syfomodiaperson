import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import AppSpinner from "../../AppSpinner";
import Lightbox from "../../Lightbox";
import Feilmelding from "../../Feilmelding";
import Side from "../../../sider/Side";
import AvbrytMote from "../components/AvbrytMote";
import * as moterActions from "../../../data/mote/moter_actions";
import * as epostinnholdActions from "../../../data/mote/epostinnhold_actions";
import { Navigate } from "react-router-dom";
import { withRouter } from "@/components/mote/container/withRouter";

export class AvbrytMoteSide extends Component {
  constructor(props) {
    super(props);
    this.hentInnhold();
  }

  hentInnhold() {
    const { mote } = this.props;
    if (!mote) {
      this.props.hentMoter(this.props.fnr);
    }
  }

  avbrytMote() {
    const { avbrytMote, mote, fnr } = this.props;
    avbrytMote(mote.moteUuid, fnr);
  }

  render() {
    const {
      avbryter,
      avbrytFeilet,
      hentingFeiletBool,
      mote,
      henter,
      arbeidstaker,
    } = this.props;
    return (
      <Side tittel="Avbryt møteforespørsel">
        {(() => {
          if (hentingFeiletBool) {
            return <Feilmelding />;
          }
          if (henter) {
            return <AppSpinner />;
          } else if (mote) {
            return (
              <Lightbox
                onClose={() => <Navigate to={`/sykefravaer/mote`} replace />}
              >
                {(() => {
                  return (
                    <AvbrytMote
                      arbeidstaker={arbeidstaker}
                      avbrytFeilet={avbrytFeilet}
                      avbryter={avbryter}
                      mote={mote}
                      onSubmit={() => {
                        this.avbrytMote();
                      }}
                      avbrytHref={`/sykefravaer/mote`}
                    />
                  );
                })()}
              </Lightbox>
            );
          }
          return <Feilmelding />;
        })()}
      </Side>
    );
  }
}

AvbrytMoteSide.propTypes = {
  avbryter: PropTypes.bool,
  fnr: PropTypes.string,
  henter: PropTypes.bool,
  hentingFeiletBool: PropTypes.bool,
  mote: PropTypes.object,
  arbeidstaker: PropTypes.object,
  hentMoter: PropTypes.func,
  avbrytMote: PropTypes.func,
  avbrytFeilet: PropTypes.bool,
};

export function mapStateToProps(state, ownProps) {
  const mote = state.moter.data.filter((m) => {
    return m.moteUuid === ownProps.match.params.moteUuid;
  })[0];
  return {
    mote,
    arbeidstaker: state.navbruker.data,
    hentingFeiletBool:
      state.moter.hentingFeilet || state.navbruker.hentingFeilet,
    avbryter: state.moter.avbryter,
    avbrytFeilet: state.moter.avbrytFeilet,
    henter: state.moter.henter || state.navbruker.henter,
  };
}

const AvbrytMoteContainer = connect(
  mapStateToProps,
  Object.assign({}, moterActions, epostinnholdActions)
)(AvbrytMoteSide);

export default withRouter(AvbrytMoteContainer);
