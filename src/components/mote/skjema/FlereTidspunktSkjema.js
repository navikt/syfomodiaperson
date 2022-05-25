import React, { useState } from "react";
import PropTypes from "prop-types";
import { Form } from "react-final-form";
import AlertStripe from "nav-frontend-alertstriper";
import KnappBase from "nav-frontend-knapper";
import Tidspunkter from "./Tidspunkter";
import { genererDato } from "../utils";
import { validerTidspunkt } from "@/utils/valideringUtils";
import { alternativAlreadyExists } from "@/utils/moteplanleggerUtils";

const texts = {
  leggTil: "Flere alternativer",
  send: "Send",
  avbryt: "Avbryt",
  duplicateTidspunktError: "Et av tidspunktene er allerede foreslått",
  genericError: "Beklager, det oppstod en feil. Prøv igjen senere!",
};

export const getData = (values) => {
  return values.tidspunkter
    .filter((tidspunkt) => tidspunkt.dato && tidspunkt.klokkeslett)
    .map((tidspunkt) => {
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
        <p>{texts.genericError}</p>
      </AlertStripe>
    </div>
  );
};

const DuplicateTidspunktError = () => {
  return (
    <div className="blokk">
      <AlertStripe type="feil">
        <p>{texts.duplicateTidspunktError}</p>
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
  } = props;
  const [showSameTidspunktErrorMessage, setShowSameTidspunktErrorMessage] =
    useState(false);
  const submit = (values) => {
    const duplicateTidspunkt = (values.tidspunkter || []).find(
      (newAlternativ) => {
        return alternativAlreadyExists(mote, newAlternativ);
      }
    );

    if (duplicateTidspunkt) {
      setShowSameTidspunktErrorMessage(true);
    } else {
      setShowSameTidspunktErrorMessage(false);
      const data = dekorerMedSted(getData(values), mote.alternativer[0].sted);
      opprettFlereAlternativ(data, mote.moteUuid, fnr);
    }
  };

  return (
    <div className="fleretidspunkt">
      <Form
        onSubmit={(values) => submit(values)}
        validate={(values) => validate(values, props)}
      >
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Tidspunkter antallNyeTidspunkt={antallNyeTidspunkt} />
            <div className="blokk--l">
              <button type="button" className="lenke" onClick={flereAlternativ}>
                {texts.leggTil}
              </button>
            </div>
            {nyeAlternativFeilet && <Feilmelding />}
            {showSameTidspunktErrorMessage && <DuplicateTidspunktError />}
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
        )}
      </Form>
    </div>
  );
};

FlereTidspunktSkjema.propTypes = {
  fnr: PropTypes.string,
  mote: PropTypes.object,
  flereAlternativ: PropTypes.func,
  nyeAlternativFeilet: PropTypes.bool,
  senderNyeAlternativ: PropTypes.bool,
  opprettFlereAlternativ: PropTypes.func,
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
    tidspunkterFeilmeldinger = tidspunkterFeilmeldinger.map(() =>
      validerTidspunkt({})
    );
    feilmeldinger.tidspunkter = tidspunkterFeilmeldinger;
  } else {
    tidspunkterFeilmeldinger = tidspunkterFeilmeldinger.map(
      (tidspunkt, index) => {
        const tidspunktValue = values.tidspunkter[index];
        return validerTidspunkt(tidspunktValue);
      }
    );
    feilmeldinger.tidspunkter = tidspunkterFeilmeldinger;
  }
  return feilmeldinger;
}

export default FlereTidspunktSkjema;
