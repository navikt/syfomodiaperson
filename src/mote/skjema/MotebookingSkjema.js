import React, { Component } from "react";
import PropTypes from "prop-types";
import { Field, reduxForm } from "redux-form";
import AlertStripe from "nav-frontend-alertstriper";
import { Hovedknapp } from "nav-frontend-knapper";
import VelgLeder from "./VelgLeder";
import Tidspunkter from "./Tidspunkter";
import TextField from "../TextField";
import KontaktInfoFeilmelding from "../components/KontaktInfoFeilmelding";
import Sidetopp from "../../components/Sidetopp";
import { genererDato, erGyldigKlokkeslett, erGyldigDato } from "../utils";
import { getLedetekstFraFeilAarsak } from "../components/MotebookingStatus";

export const MAX_LENGTH_STED = 200;

const texts = {
  pageHeader: "Møteforespørsel",
  kontaktinfoErrorMessage: {
    reservert:
      "<p>Den sykmeldte har reservert seg mot elektronisk kommunikasjon med det offentlige." +
      "Du kan fortsatt sende møteforespørsel til arbeidsgiveren digitalt, men den sykmeldte må kontaktes på annen måte.</p>",
    ingenKontaktinfo:
      "<div><p>Den sykmeldte er ikke registrert i Kontakt- og reservasjonsregisteret (KRR)." +
      "Du kan fortsatt sende møteforespørsel til arbeidsgiveren digitalt, men den sykmeldte må kontaktes på annen måte</p>" +
      '<p>Den sykmeldte kan registrere kontaktinformasjonen sin her: <a target="_blank" href="http://eid.difi.no/nb/oppdater-kontaktinformasjonen-din">http://eid.difi.no/nb/oppdater-kontaktinformasjonen-din</a></p></div>',
    utgatt:
      "<div><p>Den sykmeldtes kontaktinformasjon i Kontakt- og reservasjonsregisteret (KRR) er for gammel og kan ikke brukes." +
      "Du kan fortsatt sende møteforespørsel til arbeidsgiveren digitalt, men den sykmeldte må kontaktes på annen måte.</p>" +
      '    <p>Den sykmeldte kan oppdatere kontaktinformasjonen sin her: <a target="_blank" href="http://eid.difi.no/nb/oppdater-kontaktinformasjonen-din">http://eid.difi.no/nb/oppdater-kontaktinformasjonen-din</a></p></div>',
    generell:
      "<div><p>Vi klarte ikke å finne kontaktinformasjon om den sykmeldte og kan derfor ikke sende varsler til personen.</p></div>",
  },
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
  validationErrorMessage: {
    dateMissing: "Vennligst angi dato",
    dateWrongFormat: "Vennligst angi riktig datoformat; dd.mm.åååå",
    timeMissing: "Vennligst angi klokkeslett",
    timeWrongFormat: "Vennligst angi riktig format; f.eks. 13.00",
    placeMissing: "Vennligst angi møtested",
    placeTooLong: `Maks ${MAX_LENGTH_STED} tegn tillatt`,
  },
  send: "Send",
};

export const OPPRETT_MOTE_SKJEMANAVN = "opprettMote";

export function getData(values) {
  const alternativer = values.tidspunkter.map((tidspunkt) => {
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
      handleSubmit,
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
    const feilAarsak =
      arbeidstaker && arbeidstaker.kontaktinfo
        ? arbeidstaker.kontaktinfo.feilAarsak
        : undefined;

    return (
      <div>
        {!arbeidstaker.kontaktinfo.skalHaVarsel && (
          <KontaktInfoFeilmelding
            melding={getLedetekstFraFeilAarsak(feilAarsak)}
          />
        )}
        <Sidetopp tittel={texts.pageHeader} />
        <form className="panel" onSubmit={handleSubmit(submit)}>
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
            <Tidspunkter
              antallNyeTidspunkt={antallNyeTidspunkt}
              skjemanavn={OPPRETT_MOTE_SKJEMANAVN}
            />
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
      </div>
    );
  }
}

MotebookingSkjema.propTypes = {
  fnr: PropTypes.string,
  valgtEnhet: PropTypes.string,
  handleSubmit: PropTypes.func,
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
    tidspunkterFeilmeldinger = tidspunkterFeilmeldinger.map(() => {
      return {
        dato: texts.validationErrorMessage.dateMissing,
        klokkeslett: texts.validationErrorMessage.timeMissing,
      };
    });
    feilmeldinger.tidspunkter = tidspunkterFeilmeldinger;
  } else {
    tidspunkterFeilmeldinger = tidspunkterFeilmeldinger.map(
      (tidspunkt, index) => {
        const tidspunktValue = values.tidspunkter[index];
        const feil = {};
        if (!tidspunktValue || !tidspunktValue.klokkeslett) {
          feil.klokkeslett = texts.validationErrorMessage.timeMissing;
        } else if (!erGyldigKlokkeslett(tidspunktValue.klokkeslett)) {
          feil.klokkeslett = texts.validationErrorMessage.timeWrongFormat;
        }
        if (!tidspunktValue || !tidspunktValue.dato) {
          feil.dato = texts.validationErrorMessage.dateMissing;
        } else if (!erGyldigDato(tidspunktValue.dato)) {
          feil.dato = texts.validationErrorMessage.dateWrongFormat;
        }
        return feil;
      }
    );
    feilmeldinger.tidspunkter = tidspunkterFeilmeldinger;
  }

  if (!values.sted || values.sted.trim() === "") {
    feilmeldinger.sted = texts.validationErrorMessage.placeMissing;
  } else if (values.sted.length > MAX_LENGTH_STED) {
    feilmeldinger.sted = texts.validationErrorMessage.placeTooLong;
  }

  return feilmeldinger;
}

const ReduxSkjema = reduxForm({
  form: OPPRETT_MOTE_SKJEMANAVN,
  validate,
})(MotebookingSkjema);

export default ReduxSkjema;
