import React, { Component } from "react";
import PropTypes from "prop-types";
import Alertstripe from "nav-frontend-alertstriper";
import { keyValue } from "@navikt/digisyfo-npm";
import * as moterPropTypes from "../../propTypes";
import AppSpinner from "../../components/AppSpinner";
import { BRUKER } from "../../konstanter";

export const Innhold = ({ emne, innhold }) => {
  return (
    <div className="blokk">
      <div className="epostinnhold__forhandsvis">
        <p>{emne}</p>
      </div>
      <div className="epostinnhold__forhandsvis">
        <div dangerouslySetInnerHTML={{ __html: innhold }} />
      </div>
    </div>
  );
};

Innhold.propTypes = {
  emne: PropTypes.string,
  innhold: PropTypes.string,
};

const Feil = ({ melding = "Beklager, det oppstod en feil" }) => {
  return (
    <Alertstripe type="stopp" className="blokk">
      <p>{melding}</p>
    </Alertstripe>
  );
};

Feil.propTypes = {
  melding: PropTypes.string,
};

class DropdownInnholdsviser extends Component {
  componentDidMount() {
    if (this.props.type === BRUKER) {
      this.props.hentEpostinnhold(
        this.getDeltaker(this.props.type).deltakerUuid,
        this.props.mote.bekreftetAlternativ.id
      );
    } else {
      this.props.hentArbeidsgiverEpostinnhold(
        this.getDeltaker(this.props.type).deltakerUuid,
        this.props.mote.bekreftetAlternativ.id
      );
    }
  }

  getDeltaker(type) {
    return this.props.mote.deltakere.filter((d) => {
      return d.type === type;
    })[0];
  }

  render() {
    const {
      henter,
      hentingFeilet,
      epostinnhold,
      arbeidsgiverepostinnhold,
    } = this.props;
    const innhold =
      this.props.type === BRUKER ? epostinnhold : arbeidsgiverepostinnhold;

    if (henter) {
      return <AppSpinner />;
    }
    if (hentingFeilet) {
      return (
        <Feil melding="Beklager, det oppstod en feil ved uthenting av innhold i e-posten" />
      );
    }
    if (innhold) {
      return (
        <div>
          <Innhold {...innhold} />
        </div>
      );
    }
    return <Feil />;
  }
}

DropdownInnholdsviser.propTypes = {
  henter: PropTypes.bool,
  hentingFeilet: PropTypes.bool,
  epostinnhold: PropTypes.object,
  arbeidsgiverepostinnhold: PropTypes.object,
  type: PropTypes.string,
  hentEpostinnhold: PropTypes.func,
  hentArbeidsgiverEpostinnhold: PropTypes.func,
  ledetekster: keyValue,
  mote: moterPropTypes.motePt,
};

export default DropdownInnholdsviser;
