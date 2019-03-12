import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    getLedetekst,
    getHtmlLedetekst,
    sykmelding as sykmeldingPt,
} from '@navikt/digisyfo-npm';
import Side from '../sider/Side';
import Feilmelding from '../components/Feilmelding';
import AppSpinner from '../components/AppSpinner';
import * as motebehovActions from '../actions/motebehov_actions';
import * as veilederoppgaverActions from '../actions/veilederoppgaver_actions';
import * as oppfoelgingsdialogerActions from '../actions/oppfoelgingsdialoger_actions';
import * as oppfolgingstilfelleperioderActions from '../actions/oppfolgingstilfelleperioder_actions';
import * as sykmeldingerActions from '../actions/sykmeldinger_actions';
import * as ledereActions from '../actions/ledere_actions';
import * as virksomhetActions from '../actions/virksomhet_actions';
import { MOETEPLANLEGGER } from '../enums/menypunkter';
import { hentBegrunnelseTekst } from '../utils/tilgangUtils';
import {
    sorterMotebehovDataEtterDato,
    finnNyesteMotebehovsvarFraHverDeltaker,
} from '../utils/motebehovUtils';
import {
    harForsoktHentetLedere,
    harForsoktHentetLedetekster,
    harForsoktHentetMotebehov,
    harForsoktHentetOppfoelgingsdialoger,
    ikkeHenterEllerForsoktHentetLedere,
    ikkeHenterEllerForsoktHentetMotebehov,
    ikkeHenterEllerForsoktHentetOppfoelgingsdialoger,
    ikkeHenterEllerForsoktHentetSykmeldinger,
} from '../utils/reducerUtils';
import { finnLedereUtenInnsendtMotebehov } from '../utils/ledereUtils';
import Motebehov from '../components/Motebehov';
import { bindActionCreators } from 'redux';

export class MotebehovSide extends Component {
    componentDidMount() {
        const {
            actions,
            fnr,
            skalHenteMotebehov,
            skalHenteLedere,
            skalHenteSykmeldinger,
        } = this.props;
        if (skalHenteMotebehov) {
            actions.hentMotebehov(fnr);
        }

        if (skalHenteLedere) {
            actions.hentLedere(fnr);
        }

        if (skalHenteSykmeldinger) {
            actions.hentSykmeldinger(fnr);
        }
    }

    componentWillReceiveProps(nextProps) {
        const {
            actions,
            fnr,
            skalHenteOppfoelgingsdialoger,
        } = nextProps;
        actions.hentOppfolgingstilfelleperioder(fnr);
        if (skalHenteOppfoelgingsdialoger) {
            actions.hentOppfoelgingsdialoger(fnr);
        }
    }

    render() {
        const {
            actions,
            aktiveDialoger,
            fnr,
            henter,
            hentingFeilet,
            ledereData,
            ledereUtenInnsendtMotebehov,
            ledetekster,
            motebehovListeUtenFlereSvarFraSammePerson,
            motebehovTilgang,
            oppgaver,
            sykmeldt,
            tilgang,
            ufiltrertMotebehovListeTilOppgavebehandling,
            veilederinfo,
            oppfolgingstilfelleperioder,
            sykmeldinger,
        } = this.props;
        return (<Side fnr={fnr} tittel="Møtebehov" aktivtMenypunkt={MOETEPLANLEGGER}>
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
                    if (motebehovTilgang.harTilgang === false) {
                        return (<Feilmelding
                            tittel={getLedetekst('sykefravaer.veileder.feilmelding.tittel', ledetekster)}
                            melding={getHtmlLedetekst(hentBegrunnelseTekst(motebehovTilgang.begrunnelse), ledetekster)}
                        />);
                    }
                    if (hentingFeilet) {
                        return <Feilmelding />;
                    }
                    return (<Motebehov
                        actions={actions}
                        fnr={fnr}
                        ledereData={ledereData}
                        ledereUtenInnsendtMotebehov={ledereUtenInnsendtMotebehov}
                        ledetekster={ledetekster}
                        motebehovListe={motebehovListeUtenFlereSvarFraSammePerson}
                        oppgaver={oppgaver}
                        sykmeldt={sykmeldt}
                        ufiltrertMotebehovListeTilOppgavebehandling={ufiltrertMotebehovListeTilOppgavebehandling}
                        veilederinfo={veilederinfo}
                        aktiveDialoger={aktiveDialoger}
                        oppfolgingstilfelleperioder={oppfolgingstilfelleperioder}
                        sykmeldinger={sykmeldinger}
                    />);
                })()
            }
        </Side>);
    }
}

MotebehovSide.propTypes = {
    actions: PropTypes.object,
    aktiveDialoger: PropTypes.array,
    fnr: PropTypes.string,
    henter: PropTypes.bool,
    hentingFeilet: PropTypes.bool,
    ledereData: PropTypes.arrayOf(PropTypes.object),
    ledereUtenInnsendtMotebehov: PropTypes.arrayOf(PropTypes.object),
    ledetekster: PropTypes.object,
    motebehovListeUtenFlereSvarFraSammePerson: PropTypes.arrayOf(PropTypes.object),
    motebehovTilgang: PropTypes.object,
    oppgaver: PropTypes.arrayOf(PropTypes.object),
    skalHenteLedere: PropTypes.bool,
    skalHenteMotebehov: PropTypes.bool,
    skalHenteOppfoelgingsdialoger: PropTypes.bool,
    skalHenteSykmeldinger: PropTypes.bool,
    sykmeldt: PropTypes.object,
    tilgang: PropTypes.object,
    ufiltrertMotebehovListeTilOppgavebehandling: PropTypes.arrayOf(PropTypes.object),
    veilederinfo: PropTypes.object,
    oppfolgingstilfelleperioder: PropTypes.object,
    sykmeldinger: PropTypes.arrayOf(sykmeldingPt),
};

export function mapDispatchToProps(dispatch) {
    const actions = Object.assign({}, motebehovActions, veilederoppgaverActions, oppfoelgingsdialogerActions, oppfolgingstilfelleperioderActions, sykmeldingerActions, ledereActions, virksomhetActions);
    return {
        actions: bindActionCreators(actions, dispatch),
    };
}

export const mapStateToProps = (state, ownProps) => {
    const motebehovData = state.motebehov.data;
    const sortertMotebehovListe = motebehovData.sort(sorterMotebehovDataEtterDato);
    const motebehovListeUtenFlereSvarFraSammePerson = finnNyesteMotebehovsvarFraHverDeltaker(sortertMotebehovListe);

    const ledereData = state.ledere.data;
    const oppfolgingstilfelleperioder = state.oppfolgingstilfelleperioder;
    const ledereUtenInnsendtMotebehov = finnLedereUtenInnsendtMotebehov(ledereData, motebehovData, oppfolgingstilfelleperioder);

    const aktiveDialoger = state.oppfoelgingsdialoger.data.filter((dialog) => {
        return dialog.status !== 'AVBRUTT' && new Date(dialog.godkjentPlan.gyldighetstidspunkt.tom) > new Date();
    });

    const harForsoktHentetAlt = harForsoktHentetMotebehov(state.motebehov)
    && harForsoktHentetLedetekster(state.ledetekster)
    && harForsoktHentetOppfoelgingsdialoger(state.oppfoelgingsdialoger)
    && harForsoktHentetLedere(state.ledere);
    return {
        fnr: ownProps.params.fnr,
        henter: !harForsoktHentetAlt,
        hentingFeilet:
        state.motebehov.hentingFeilet
        || state.ledetekster.hentingFeilet,
        ledereData,
        ledereUtenInnsendtMotebehov,
        ledetekster: state.ledetekster.data,
        motebehovListeUtenFlereSvarFraSammePerson,
        motebehovTilgang: state.motebehov.tilgang,
        oppgaver: state.veilederoppgaver.data,
        skalHenteLedere: ikkeHenterEllerForsoktHentetLedere(state.ledere),
        skalHenteMotebehov: ikkeHenterEllerForsoktHentetMotebehov(state.motebehov),
        skalHenteOppfoelgingsdialoger: ikkeHenterEllerForsoktHentetOppfoelgingsdialoger(state.oppfoelgingsdialoger),
        skalHenteSykmeldinger: ikkeHenterEllerForsoktHentetSykmeldinger(state.sykmeldinger),
        sykmeldt: state.navbruker.data,
        tilgang: state.tilgang.data,
        ufiltrertMotebehovListeTilOppgavebehandling: state.motebehov.data,
        veilederinfo: state.veilederinfo.data,
        aktiveDialoger,
        oppfolgingstilfelleperioder,
        sykmeldinger: state.sykmeldinger.data,
    };
};

const MotebehovContainer = connect(mapStateToProps, mapDispatchToProps)(MotebehovSide);

export default MotebehovContainer;
