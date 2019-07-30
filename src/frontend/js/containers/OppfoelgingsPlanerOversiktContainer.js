import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    getLedetekst,
    getHtmlLedetekst,
} from '@navikt/digisyfo-npm';
import Side from '../sider/Side';
import * as oppdialogActions from '../actions/oppfoelgingsdialoger_actions';
import * as virksomhetActions from '../actions/virksomhet_actions';
import Feilmelding from '../components/Feilmelding';
import OppfoelgingsPlanerOversikt from '../components/oppfoelgingsdialoger/OppfoelgingsPlanerOversikt';
import AppSpinner from '../components/AppSpinner';
import IngenPlaner from '../components/oppfoelgingsdialoger/IngenPlaner';
import { OPPFOELGINGSPLANER } from '../enums/menypunkter';
import { hentBegrunnelseTekst } from '../utils/tilgangUtils';

export class OppfoelgingsPlanerOversiktSide extends Component {
    componentWillMount() {
        const {
            fnr,
            actions,
            henterDialoger,
            hentetDialoger,
        } = this.props;
        if (!henterDialoger && !hentetDialoger) {
            actions.hentOppfoelgingsdialoger(fnr);
        }
    }

    render() {
        const {
            actions,
            aktiveDialoger,
            inaktiveDialoger,
            ledetekster,
            henter,
            hentingFeilet,
            tilgang,
            fnr,
        } = this.props;
        return (<Side fnr={fnr} tittel="Oppfølgingsplaner" aktivtMenypunkt={OPPFOELGINGSPLANER}>
            {
                (() => {
                    if (henter) {
                        return <AppSpinner />;
                    }
                    if (!tilgang.harTilgang) {
                        return (<Feilmelding
                            tittel={getLedetekst('sykefravaer.veileder.feilmelding.tittel', ledetekster)}
                            melding={getHtmlLedetekst(hentBegrunnelseTekst(tilgang.begrunnelse), ledetekster)}
                        />);
                    }
                    if (hentingFeilet) {
                        return <Feilmelding />;
                    }
                    if (aktiveDialoger.length === 0 && inaktiveDialoger.length === 0) {
                        return <IngenPlaner />;
                    }
                    return (<div>
                        <OppfoelgingsPlanerOversikt
                            actions={actions}
                            aktiveDialoger={aktiveDialoger}
                            inaktiveDialoger={inaktiveDialoger}
                            fnr={fnr}
                        />
                    </div>);
                })()
            }
        </Side>);
    }
}

OppfoelgingsPlanerOversiktSide.propTypes = {
    fnr: PropTypes.string,
    actions: PropTypes.object,
    aktiveDialoger: PropTypes.array,
    inaktiveDialoger: PropTypes.array,
    henter: PropTypes.bool,
    hentingFeilet: PropTypes.bool,
    henterDialoger: PropTypes.bool,
    hentetDialoger: PropTypes.bool,
    tilgang: PropTypes.object,
    ledetekster: PropTypes.object,
};

export function mapDispatchToProps(dispatch) {
    const actions = Object.assign({}, oppdialogActions, virksomhetActions);
    return {
        actions: bindActionCreators(actions, dispatch),
    };
}

export function mapStateToProps(state, ownProps) {
    const henter = state.oppfoelgingsdialoger.henter || state.ledetekster.henter || state.tilgang.henter;
    const hentingFeilet = state.oppfoelgingsdialoger.hentingFeilet || state.ledetekster.hentingFeilet || state.tilgang.hentingFeilet || state.tilgang.hentingFeilet;
    const hentetDialoger = state.oppfoelgingsdialoger.hentet;
    const henterDialoger = state.oppfoelgingsdialoger.henter;

    const oppfoelgingsdialoger = state.oppfoelgingsdialoger.data.map((dialog) => {
        const oppgaver = state.veilederoppgaver.data.filter((oppgave) => {
            return oppgave.type === 'SE_OPPFOLGINGSPLAN' && oppgave.uuid === dialog.uuid;
        });
        return Object.assign({}, dialog, {
            oppgaver,
        });
    });
    const aktiveDialoger = oppfoelgingsdialoger.filter((dialog) => {
        return dialog.status !== 'AVBRUTT' && new Date(dialog.godkjentPlan.gyldighetstidspunkt.tom) > new Date();
    });
    const inaktiveDialoger = [];
    oppfoelgingsdialoger.forEach((dialog) => {
        if (!aktiveDialoger.includes(dialog)) {
            inaktiveDialoger.push(dialog);
        }
    });
    return {
        brukernavn: state.navbruker.data.navn,
        fnr: ownProps.params.fnr,
        henter,
        hentingFeilet,
        hentetDialoger,
        henterDialoger,
        ledetekster: state.ledetekster.data,
        veilederoppgaver: state.veilederoppgaver.data,
        inaktiveDialoger,
        aktiveDialoger,
        tilgang: state.tilgang.data,
    };
}

const OppfoelgingsPlanerOversiktContainer = connect(mapStateToProps, mapDispatchToProps)(OppfoelgingsPlanerOversiktSide);
export default OppfoelgingsPlanerOversiktContainer;
