import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    getLedetekst,
    getHtmlLedetekst,
} from '@navikt/digisyfo-npm';
import * as ledereActions from '../actions/ledere_actions';
import * as moteActions from '../actions/moter_actions';
import * as virksomhetActions from '../actions/virksomhet_actions';
import MotebookingSkjema from '../mote/skjema/MotebookingSkjema';
import AppSpinner from '../components/AppSpinner';
import Feilmelding from '../components/Feilmelding';

const MotebookingSkjemaContainer = (
    {
        ledetekster,
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
    }) => {
    if (henter) {
        return <AppSpinner />;
    } else if (skjermetBruker) {
        return (<Feilmelding
            tittel={getLedetekst('mote.motebookingskjemacontainer.tittel', ledetekster)}
            melding={getHtmlLedetekst('mote.motebookingskjemacontainer.melding', ledetekster)} />);
    } else if (hentingFeilet) {
        return <Feilmelding />;
    } else if (!valgtEnhet) {
        return (<Feilmelding
            tittel="Du må velge Enhet"
            melding={{ __html: '<p>For at du skal kunne opprette et møte må du velge hvilken enhet dette møtet skal knyttes til. Det styres av hvilken enhet du har valgt i toppmenyen. ' +
            'Hvis du får denne og det ser ut som du allerede har valgt riktig enhet, prøv å velg en annen enhet og så tilbake igjen.</p>' }} />);
    } else if (ledere.length === 0) {
        return (<Feilmelding
            tittel="Lederen mangler!"
            melding={{ __html: '<p>Møteplanleggeren kan bare brukes hvis nærmeste leder er registrert. Arbeidsgiveren må gjøre dette i Altinn.</p>' }} />);
    }
    return (<MotebookingSkjema
        antallNyeTidspunkt={antallNyeTidspunkt}
        arbeidstaker={arbeidstaker}
        fjernAlternativ={fjernAlternativ}
        flereAlternativ={flereAlternativ}
        fnr={fnr}
        ledetekster={ledetekster}
        ledere={ledere}
        opprettMote={opprettMote}
        valgtEnhet={valgtEnhet}
    />);
};

MotebookingSkjemaContainer.propTypes = {
    antallNyeTidspunkt: PropTypes.number,
    arbeidstaker: PropTypes.object,
    fnr: PropTypes.string,
    fjernAlternativ: PropTypes.func,
    flereAlternativ: PropTypes.func,
    henter: PropTypes.bool,
    hentingFeilet: PropTypes.bool,
    ledetekster: PropTypes.object,
    ledere: PropTypes.array,
    opprettMote: PropTypes.func,
    skjermetBruker: PropTypes.bool,
    valgtEnhet: PropTypes.string,
};

export function mapStateToProps(state, ownProps) {
    const ledere = state.ledere.data.filter((leder) => {
        return leder.erOppgitt;
    });

    return {
        fnr: ownProps.fnr,
        ledere,
        arbeidstaker: state.navbruker.data,
        valgtEnhet: state.enhet.valgtEnhet,
        henter: state.ledere.henter || state.navbruker.henter || state.ledetekster.henter,
        hentLedereFeiletBool: state.ledere.hentingFeilet,
        skjermetBruker: state.moter.skjermetBruker,
        antallNyeTidspunkt: state.moter.antallNyeTidspunkt,
        ledetekster: state.ledetekster.data,
        hentingFeilet: state.navbruker.hentingFeilet,
    };
}

const container = connect(mapStateToProps, Object.assign({}, ledereActions, virksomhetActions, moteActions))(MotebookingSkjemaContainer);

export default container;
