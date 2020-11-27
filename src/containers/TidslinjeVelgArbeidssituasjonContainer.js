import React, { Component } from "react";
import PropTypes from "prop-types";
import { TIDSLINJE_TYPER, keyValue } from "@navikt/digisyfo-npm";
import Radiofaner from "../components/Radiofaner";

const texts = {
  harArbeidsgiver: "Jeg har arbeidsgiver",
  harIkkeArbeidsgiver: "Jeg har ikke arbeidsgiver",
  hjelpetekst:
    "Velg «Jeg har ikke arbeidsgiver» dersom du er for eks. selvstendig næringsdrivende, frilanser eller arbeidsledig.",
};

const verdier = {};
verdier[TIDSLINJE_TYPER.MED_ARBEIDSGIVER] = "med-arbeidsgiver";
verdier[TIDSLINJE_TYPER.UTEN_ARBEIDSGIVER] = "uten-arbeidsgiver";

const arbeidssituasjoner = () => {
  return [
    {
      tittel: texts.harArbeidsgiver,
      verdi: TIDSLINJE_TYPER.MED_ARBEIDSGIVER,
    },
    {
      tittel: texts.harIkkeArbeidsgiver,
      verdi: TIDSLINJE_TYPER.UTEN_ARBEIDSGIVER,
      hjelpetekst: {
        tittel: texts.harIkkeArbeidsgiver,
        tekst: texts.hjelpetekst,
      },
    },
  ];
};

export class VelgArbeidssituasjon extends Component {
  changeHandler(verdi) {
    this.props.endreUrl(`${this.props.rootUrl}/tidslinjen/${verdier[verdi]}`);
    this.props.hentTidslinjer(verdi);
  }
  render() {
    const { valgtArbeidssituasjon } = this.props;
    return (
      <Radiofaner
        alternativer={arbeidssituasjoner()}
        valgtAlternativ={valgtArbeidssituasjon}
        changeHandler={(v) => {
          this.changeHandler(v);
        }}
        radioName="tidslinje-arbeidssituasjon"
        className="blokk-xl"
      />
    );
  }
}

VelgArbeidssituasjon.propTypes = {
  ledetekster: keyValue,
  valgtArbeidssituasjon: PropTypes.string,
  hentTidslinjer: PropTypes.func,
  endreUrl: PropTypes.func,
  rootUrl: PropTypes.string,
};

export default VelgArbeidssituasjon;
