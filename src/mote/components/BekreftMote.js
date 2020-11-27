import React, { Component } from "react";
import PropTypes from "prop-types";
import { keyValue } from "@navikt/digisyfo-npm";
import * as motePropTypes from "../../propTypes";
import { ARBEIDSGIVER } from "../../konstanter";
import BekreftMoteSkjema from "./BekreftMoteSkjema";
import BekreftMoteUtenSvarSkjema from "./BekreftMoteUtenSvarSkjema";

class BekreftMote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bekreftet: false,
    };
    if (this.moteBesvart(this.props.mote, this.props.alternativ)) {
      this.props.bekreftMote();
    }
  }

  moteBesvart(mote, alternativ) {
    let arbeidsgiverHarSvart = false;

    const arbeidsgiver = mote.deltakere.filter((d) => {
      return d.type === ARBEIDSGIVER;
    })[0];
    arbeidsgiver.svar.forEach((s) => {
      if (
        arbeidsgiver.svartidspunkt !== null &&
        s.valgt &&
        s.id === alternativ.id
      ) {
        arbeidsgiverHarSvart = true;
      }
    });
    return arbeidsgiverHarSvart;
  }

  render() {
    if (this.props.moteBekreftet) {
      return (
        <BekreftMoteSkjema
          arbeidstaker={this.props.arbeidstaker}
          onSubmit={this.props.onSubmit}
          mote={this.props.mote}
          ledetekster={this.props.ledetekster}
          avbrytHref={this.props.avbrytHref}
          bekrefter={this.props.bekrefter}
          hentEpostinnhold={this.props.hentEpostinnhold}
          bekreftFeilet={this.props.bekreftFeilet}
        />
      );
    }
    return (
      <BekreftMoteUtenSvarSkjema
        mote={this.props.mote}
        avbrytHref={this.props.avbrytHref}
        bekrefter={this.props.bekrefter}
        bekreftFeilet={this.props.bekreftFeilet}
        bekreftMoteUtenSvar={this.props.bekreftMote}
      />
    );
  }
}
BekreftMote.propTypes = {
  arbeidstaker: PropTypes.object,
  ledetekster: keyValue,
  onSubmit: PropTypes.func,
  avbrytHref: PropTypes.string,
  mote: motePropTypes.motePt,
  bekrefter: PropTypes.bool,
  bekreftFeilet: PropTypes.bool,
  hentEpostinnhold: PropTypes.func,
  alternativ: PropTypes.object,
  bekreftMote: PropTypes.func,
  moteBekreftet: PropTypes.bool,
};

export default BekreftMote;
