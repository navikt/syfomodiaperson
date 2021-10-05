import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as ledereActions from "../../../data/leder/ledere_actions";
import * as moteActions from "../../../data/mote/moter_actions";
import MotebookingSkjema from "../skjema/MotebookingSkjema";
import AppSpinner from "../../AppSpinner";
import Feilmelding from "../../Feilmelding";

const texts = {
  skjermetBrukerError: {
    title: "Ikke mulig å sende møteforespørsel",
    message: "<p>Brukeren er registrert med skjermingskode 6 eller 7.</p>",
  },
  noValgtEnhetError: {
    title: "Du må velge Enhet",
    message:
      "<p>For at du skal kunne opprette et møte må du velge hvilken enhet dette møtet skal knyttes til. Det styres av hvilken enhet du har valgt i toppmenyen. " +
      "Hvis du får denne og det ser ut som du allerede har valgt riktig enhet, prøv å velg en annen enhet og så tilbake igjen.</p>",
  },
  noLederError: {
    title: "Lederen mangler!",
    message:
      "<p>Møteplanleggeren kan bare brukes hvis nærmeste leder er registrert. Arbeidsgiveren må gjøre dette i Altinn.</p>",
  },
};

const MotebookingSkjemaContainer = ({
  antallNyeTidspunkt,
  arbeidstaker,
  fjernAlternativ,
  flereAlternativ,
  fnr,
  henter,
  hentingFeilet,
  ledere,
  opprettMote,
  skjermetBruker,
  valgtEnhet,
  sender,
  sendingFeilet,
}) => {
  if (henter) {
    return <AppSpinner />;
  } else if (skjermetBruker) {
    return (
      <Feilmelding
        tittel={texts.skjermetBrukerError.title}
        melding={{ __html: texts.skjermetBrukerError.message }}
      />
    );
  } else if (hentingFeilet) {
    return <Feilmelding />;
  } else if (!valgtEnhet) {
    return (
      <Feilmelding
        tittel={texts.noValgtEnhetError.title}
        melding={{ __html: texts.noValgtEnhetError.message }}
      />
    );
  } else if (ledere.length === 0) {
    return (
      <Feilmelding
        tittel={texts.noLederError.title}
        melding={{ __html: texts.noLederError.message }}
      />
    );
  }
  return (
    <MotebookingSkjema
      antallNyeTidspunkt={antallNyeTidspunkt}
      arbeidstaker={arbeidstaker}
      fjernAlternativ={fjernAlternativ}
      flereAlternativ={flereAlternativ}
      fnr={fnr}
      ledere={ledere}
      opprettMote={opprettMote}
      valgtEnhet={valgtEnhet}
      sender={sender}
      sendingFeilet={sendingFeilet}
    />
  );
};

MotebookingSkjemaContainer.propTypes = {
  antallNyeTidspunkt: PropTypes.number,
  arbeidstaker: PropTypes.object,
  fnr: PropTypes.string,
  fjernAlternativ: PropTypes.func,
  flereAlternativ: PropTypes.func,
  henter: PropTypes.bool,
  hentingFeilet: PropTypes.bool,
  ledere: PropTypes.array,
  opprettMote: PropTypes.func,
  skjermetBruker: PropTypes.bool,
  valgtEnhet: PropTypes.string,
  sender: PropTypes.bool,
  sendingFeilet: PropTypes.bool,
};

export function mapStateToProps(state, ownProps) {
  const ledere = state.ledere.currentLedere.filter((leder) => {
    return leder.erOppgitt;
  });

  return {
    fnr: ownProps.fnr,
    ledere,
    arbeidstaker: state.navbruker.data,
    valgtEnhet: state.enhet.valgtEnhet,
    henter: state.ledere.henter || state.navbruker.henter,
    hentLedereFeiletBool: state.ledere.hentingFeilet,
    skjermetBruker: state.moter.skjermetBruker,
    antallNyeTidspunkt: state.moter.antallNyeTidspunkt,
    hentingFeilet: state.navbruker.hentingFeilet,
    sender: state.moter.sender,
    sendingFeilet: state.moter.sendingFeilet,
  };
}

const container = connect(
  mapStateToProps,
  Object.assign({}, ledereActions, moteActions)
)(MotebookingSkjemaContainer);

export default container;
