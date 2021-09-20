import React, { Component } from "react";
import PropTypes from "prop-types";
import { Field, Form } from "react-final-form";
import AlertStripe from "nav-frontend-alertstriper";
import { Hovedknapp } from "nav-frontend-knapper";
import VelgLeder from "./VelgLeder";
import Tidspunkter from "./Tidspunkter";
import TextField from "../TextField";
import KontaktInfoAdvarsel from "../components/KontaktInfoAdvarsel";
import Sidetopp from "../../Sidetopp";
import { genererDato } from "../utils";
import { validerSted, validerTidspunkt } from "@/utils/valideringUtils";

export const MAX_LENGTH_STED = 200;

const texts = {
  pageHeader: "Møteforespørsel",
  captions: {
    employerInfo: "1. Fyll inn arbeidsgiverens opplysninger",
    timeAndPlace: "2. Velg dato, tid og sted",
  },
  flereTidspunkt: {
    add: "Flere alternativer",
    remove: "Fjern siste",
  },
  stedPlaceholder: "Skriv møtested eller om det er et videomøte",
  sendingFeilerErrorMessage:
    "Beklager, det oppstod en feil. Prøv igjen litt senere.",
  send: "Send",
};

export function getData(values) {
  const alternativer = values.tidspunkter
    .filter((tidspunkt) => tidspunkt.dato && tidspunkt.klokkeslett)
    .map((tidspunkt) => {
      return {
        tid: genererDato(tidspunkt.dato, tidspunkt.klokkeslett),
        sted: values.sted,
      };
    });
  return {
    alternativer,
  };
}

export class MotebookingSkjema extends Component {
  constructor() {
    super();
    this.state = {
      valgtArbeidsgiver: "VELG",
    };
  }

  render() {
    const {
      arbeidstaker,
      opprettMote,
      fnr,
      sender,
      sendingFeilet,
      ledere,
      valgtEnhet,
      flereAlternativ,
      fjernAlternativ,
      antallNyeTidspunkt,
    } = this.props;
    const submit = (values) => {
      const data = getData(values);
      data.fnr = fnr;
      data.navEnhet = valgtEnhet;
      data.orgnummer = this.state.valgtArbeidsgiver;
      opprettMote(data);
    };

    return (
      <div>
        {arbeidstaker.kontaktinfo.skalHaVarsel === false && (
          <KontaktInfoAdvarsel />
        )}
        <Sidetopp tittel={texts.pageHeader} />
        <Form
          onSubmit={(values) => submit(values)}
          validate={(values) => validate(values, this.props)}
        >
          {({ handleSubmit }) => (
            <form className="panel" onSubmit={handleSubmit}>
              <div className="skjema-fieldset js-arbeidsgiver blokk--l">
                <legend>{texts.captions.employerInfo}</legend>
                <VelgLeder
                  ledere={ledere}
                  valgtArbeidsgiver={this.state.valgtArbeidsgiver}
                  velgArbeidsgiver={(orgnummer) => {
                    this.setState({
                      valgtArbeidsgiver: orgnummer,
                    });
                  }}
                />
              </div>
              <fieldset className="skjema-fieldset blokk">
                <legend>{texts.captions.timeAndPlace}</legend>
                <Tidspunkter antallNyeTidspunkt={antallNyeTidspunkt} />
                <div className="blokk--l">
                  <button
                    type="button"
                    className="lenke"
                    onClick={flereAlternativ}
                    style={{ marginRight: "1em" }}
                  >
                    {texts.flereTidspunkt.add}
                  </button>
                  {antallNyeTidspunkt > 1 && (
                    <button
                      type="button"
                      className="lenke"
                      onClick={fjernAlternativ}
                    >
                      {texts.flereTidspunkt.remove}
                    </button>
                  )}
                </div>
                <Field
                  label="Sted"
                  id="sted"
                  component={TextField}
                  name="sted"
                  maxLength={MAX_LENGTH_STED}
                  placeholder={texts.stedPlaceholder}
                />
              </fieldset>

              <div aria-live="polite" role="alert">
                {sendingFeilet && (
                  <AlertStripe type="info">
                    <p className="sist">{texts.sendingFeilerErrorMessage}</p>
                  </AlertStripe>
                )}
              </div>

              <div className="knapperad blokk">
                <Hovedknapp
                  spinner={sender}
                  disabled={sender || this.state.valgtArbeidsgiver === "VELG"}
                >
                  {texts.send}
                </Hovedknapp>
              </div>
            </form>
          )}
        </Form>
      </div>
    );
  }
}

MotebookingSkjema.propTypes = {
  fnr: PropTypes.string,
  valgtEnhet: PropTypes.string,
  opprettMote: PropTypes.func,
  sender: PropTypes.bool,
  sendingFeilet: PropTypes.bool,
  ledere: PropTypes.array,
  arbeidstaker: PropTypes.object,
  flereAlternativ: PropTypes.func,
  fjernAlternativ: PropTypes.func,
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
  feilmeldinger.sted = validerSted(values.sted, MAX_LENGTH_STED);

  return feilmeldinger;
}

export default MotebookingSkjema;
