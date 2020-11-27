import React, { Component } from "react";
import PropTypes from "prop-types";
import { Radio } from "nav-frontend-skjema";
import Alertstripe from "nav-frontend-alertstriper";
import * as moterPropTypes from "../../propTypes";
import AppSpinner from "../../components/AppSpinner";
import { BRUKER, ARBEIDSGIVER } from "../../konstanter";

const texts = {
  info: "Informasjon som sendes",
  tilArbeidsgiver: "til arbeidsgiver",
  tilArbeidstaker: "til arbeidstaker",
};

const Innhold = ({ emne, innhold }) => {
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

export const Innholdsvelger = ({ onChange, valgtDeltakertype }) => {
  return (
    <ul className="radiofaner radiofaner--innholdsvelger">
      <li className="radiofaner__valg">
        <Radio
          label={texts.tilArbeidsgiver}
          checked={valgtDeltakertype === ARBEIDSGIVER}
          onChange={() => {
            onChange(ARBEIDSGIVER);
          }}
          name="innholdstype"
          value="arbeidsgiver"
          id="epostinnhold-til-arbeidsgiver"
        />
      </li>
      <li className="radiofaner__valg">
        <Radio
          label={texts.tilArbeidstaker}
          checked={valgtDeltakertype === BRUKER}
          onChange={() => {
            onChange(BRUKER);
          }}
          name="innholdstype"
          value="arbeidstaker"
          id="epostinnhold-til-arbeidstaker"
        />
      </li>
    </ul>
  );
};

Innholdsvelger.propTypes = {
  onChange: PropTypes.func,
  valgtDeltakertype: moterPropTypes.motedeltakertypePt,
};

const Feil = ({ melding = "Beklager, det oppstod en feil" }) => {
  return (
    <Alertstripe type="advarsel" className="blokk">
      <p>{melding}</p>
    </Alertstripe>
  );
};

Feil.propTypes = {
  melding: PropTypes.string,
};

class Innholdsviser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      valgtDeltakertype: ARBEIDSGIVER,
    };
  }

  componentDidMount() {
    this.props.hentEpostinnhold(this.getArbeidsgiver().deltakerUuid);
  }

  getSykmeldt() {
    return this.props.mote.deltakere.filter((d) => {
      return d.type === BRUKER;
    })[0];
  }

  getArbeidsgiver() {
    return this.props.mote.deltakere.filter((d) => {
      return d.type === ARBEIDSGIVER;
    })[0];
  }

  render() {
    const {
      henter,
      hentingFeilet,
      epostinnhold,
      hentEpostinnhold,
      arbeidstaker,
    } = this.props;
    if (henter) {
      return <AppSpinner />;
    }
    if (hentingFeilet) {
      return (
        <Feil melding="Beklager, det oppstod en feil ved uthenting av innhold i e-posten" />
      );
    }
    if (epostinnhold) {
      return (
        <div>
          <h3 className="typo-undertittel">{texts.info}</h3>
          {arbeidstaker.kontaktinfo.skalHaVarsel && (
            <Innholdsvelger
              valgtDeltakertype={this.state.valgtDeltakertype}
              onChange={(valgtDeltakertype) => {
                this.setState({
                  valgtDeltakertype,
                });
                if (valgtDeltakertype === ARBEIDSGIVER) {
                  const arbeidsgiver = this.getArbeidsgiver();
                  hentEpostinnhold(arbeidsgiver.deltakerUuid);
                } else {
                  const sykmeldt = this.getSykmeldt();
                  hentEpostinnhold(sykmeldt.deltakerUuid);
                }
              }}
            />
          )}
          <Innhold {...epostinnhold} />
        </div>
      );
    }
    return <Feil />;
  }
}

Innholdsviser.propTypes = {
  henter: PropTypes.bool,
  hentingFeilet: PropTypes.bool,
  epostinnhold: PropTypes.object,
  arbeidstaker: PropTypes.object,
  hentEpostinnhold: PropTypes.func,
  mote: moterPropTypes.motePt,
};

export default Innholdsviser;
