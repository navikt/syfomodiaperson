import React from "react";
import PropTypes from "prop-types";
import { reduxForm } from "redux-form";
import AlertStripe from "nav-frontend-alertstriper";
import KnappBase from "nav-frontend-knapper";
import { keyValue } from "@navikt/digisyfo-npm";
import Tidspunkter from "./Tidspunkter";
import { genererDato, erGyldigKlokkeslett, erGyldigDato } from "../utils";

const texts = {
  leggTil: "Flere alternativer",
  send: "Send",
  avbryt: "Avbryt",
};

const FLERE_TIDSPUNKTER_SKJEMANAVN = "flereAlternativ";

export const getData = (values) => {
  return values.tidspunkter.map((tidspunkt) => {
    return {
      tid: genererDato(tidspunkt.dato, tidspunkt.klokkeslett),
      valgt: false,
    };
  });
};

export const dekorerMedSted = (data, sted) => {
  return data.map((alternativ) => {
    return Object.assign({}, alternativ, { sted });
  });
};

const Feilmelding = () => {
  return (
    <div className="blokk">
      <AlertStripe type="advarsel">
        <p>Beklager, det oppstod en feil. Prøv igjen senere!</p>
      </AlertStripe>
    </div>
  );
};

export const FlereTidspunktSkjema = (props) => {
  const {
    fnr,
    mote,
    opprettFlereAlternativ,
    senderNyeAlternativ,
    nyeAlternativFeilet,
    flereAlternativ,
    avbrytFlereAlternativ,
    antallNyeTidspunkt,
    handleSubmit,
  } = props;
  const submit = (values) => {
    const data = dekorerMedSted(getData(values), mote.alternativer[0].sted);
    opprettFlereAlternativ(data, mote.moteUuid, fnr);
  };

  return (
    <div className="fleretidspunkt">
      <form onSubmit={handleSubmit(submit)}>
        <Tidspunkter
          antallNyeTidspunkt={antallNyeTidspunkt}
          skjemanavn={FLERE_TIDSPUNKTER_SKJEMANAVN}
        />
        <div className="blokk--l">
          <button type="button" className="lenke" onClick={flereAlternativ}>
            {texts.leggTil}
          </button>
        </div>
        {nyeAlternativFeilet && <Feilmelding />}
        <KnappBase
          type="hoved"
          className="knapp--enten"
          spinner={senderNyeAlternativ}
          disabled={senderNyeAlternativ}
        >
          {texts.send}
        </KnappBase>
        <button
          type="button"
          className="lenke"
          onClick={() => {
            avbrytFlereAlternativ();
          }}
        >
          {texts.avbryt}
        </button>
      </form>
    </div>
  );
};

FlereTidspunktSkjema.propTypes = {
  fnr: PropTypes.string,
  mote: PropTypes.object,
  ledetekster: keyValue,
  flereAlternativ: PropTypes.func,
  nyeAlternativFeilet: PropTypes.bool,
  senderNyeAlternativ: PropTypes.bool,
  opprettFlereAlternativ: PropTypes.func,
  handleSubmit: PropTypes.func,
  avbrytFlereAlternativ: PropTypes.func,
  antallNyeTidspunkt: PropTypes.number,
};

export function validate(values, props) {
  const feilmeldinger = {};
  let tidspunkterFeilmeldinger = [];
  for (let i = 0; i < props.antallNyeTidspunkt; i += 1) {
    tidspunkterFeilmeldinger.push({});
  }

  if (!values.tidspunkter || !values.tidspunkter.length) {
    tidspunkterFeilmeldinger = tidspunkterFeilmeldinger.map(() => {
      return {
        dato: "Vennligst angi dato",
        klokkeslett: "Vennligst angi klokkeslett",
      };
    });
    feilmeldinger.tidspunkter = tidspunkterFeilmeldinger;
  } else {
    tidspunkterFeilmeldinger = tidspunkterFeilmeldinger.map(
      (tidspunkt, index) => {
        const tidspunktValue = values.tidspunkter[index];
        const feil = {};
        if (!tidspunktValue || !tidspunktValue.klokkeslett) {
          feil.klokkeslett = "Vennligst angi klokkeslett";
        } else if (!erGyldigKlokkeslett(tidspunktValue.klokkeslett)) {
          feil.klokkeslett = "Vennligst angi riktig format; f.eks. 13.00";
        }
        if (!tidspunktValue || !tidspunktValue.dato) {
          feil.dato = "Vennligst angi dato";
        } else if (!erGyldigDato(tidspunktValue.dato)) {
          feil.dato = "Vennligst angi riktig datoformat; dd.mm.åååå";
        }
        return feil;
      }
    );
    feilmeldinger.tidspunkter = tidspunkterFeilmeldinger;
  }
  return feilmeldinger;
}

const ReduxSkjema = reduxForm({
  form: FLERE_TIDSPUNKTER_SKJEMANAVN,
  validate,
})(FlereTidspunktSkjema);

export default ReduxSkjema;
