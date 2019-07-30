import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    getLedetekst,
    getHtmlLedetekst,
} from '@navikt/digisyfo-npm';
import Side from '../sider/Side';
import * as sykepengesoknaderActions from '../actions/sykepengesoknader_actions';
import * as soknaderActions from '../actions/soknader_actions';
import Feilmelding from '../components/Feilmelding';
import AppSpinner from '../components/AppSpinner';
import Soknader from '../components/sykepengesoknader/Soknader';
import Brodsmuler from '../components/Brodsmuler';
import { SYKEPENGESOKNADER } from '../enums/menypunkter';
import {
    sykepengesoknad as sykepengesoknadPt,
    soknad as soknadPt,
} from '../propTypes';
import Speilingvarsel from '../components/Speilingvarsel';
import { hentBegrunnelseTekst } from '../utils/tilgangUtils';
import { erDev } from '../selectors/toggleSelectors';
import Feilstripe from '../components/Feilstripe';

export class SykepengesoknaderSide extends Component {
    componentWillMount() {
        const { fnr } = this.props;
        if (this.props.skalHenteSykepengesoknader) {
            this.props.actions.hentSykepengesoknader(fnr);
        }
        if (this.props.skalHenteSoknader) {
            this.props.actions.hentSoknader(fnr);
        }
    }

    render() {
        const {
            brukernavn,
            ledetekster,
            henter,
            hentingFeilet,
            hentingFeiletSykepengesoknader,
            hentingFeiletSoknader,
            tilgang,
            sykepengesoknader,
            fnr,
            soknader,
        } = this.props;
        const brodsmuler = [{
            tittel: 'Ditt sykefravær',
        }, {
            tittel: 'Søknader om sykepenger',
        }];

        return (<Side fnr={fnr} tittel="Sykepengesøknader" aktivtMenypunkt={SYKEPENGESOKNADER}>
            {
                (() => {
                    if (henter) {
                        return <AppSpinner />;
                    }
                    if (!tilgang.harTilgang && !erDev()) {
                        return (<Feilmelding
                            tittel={getLedetekst('sykefravaer.veileder.feilmelding.tittel', ledetekster)}
                            melding={getHtmlLedetekst(hentBegrunnelseTekst(tilgang.begrunnelse), ledetekster)}
                        />);
                    }
                    if (hentingFeilet && !erDev()) {
                        return <Feilmelding />;
                    }
                    return (<div>
                        <Feilstripe
                            className="blokk--s"
                            tekst={`Beklager – vi kunne ikke hente alle sykepengesøknadene til ${brukernavn}`}
                            vis={hentingFeiletSoknader || hentingFeiletSykepengesoknader}
                        />
                        <Speilingvarsel brukernavn={brukernavn} />
                        <div className="speiling">
                            <Brodsmuler brodsmuler={brodsmuler} />
                            <Soknader
                                sykepengesoknader={sykepengesoknader}
                                soknader={soknader}
                                fnr={fnr}
                            />
                        </div>
                    </div>);
                })()
            }
        </Side>);
    }
}

SykepengesoknaderSide.propTypes = {
    fnr: PropTypes.string,
    brukernavn: PropTypes.string,
    actions: PropTypes.object,
    sykepengesoknader: PropTypes.arrayOf(sykepengesoknadPt),
    henter: PropTypes.bool,
    hentingFeilet: PropTypes.bool,
    tilgang: PropTypes.object,
    ledetekster: PropTypes.object,
    skalHenteSykepengesoknader: PropTypes.bool,
    skalHenteSoknader: PropTypes.bool,
    hentingFeiletSoknader: PropTypes.bool,
    hentingFeiletSykepengesoknader: PropTypes.bool,
    soknader: PropTypes.arrayOf(soknadPt),
};

export function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, sykepengesoknaderActions, soknaderActions), dispatch),
    };
}

export function mapStateToProps(state, ownProps) {
    const henter = state.sykepengesoknader.henter
        || state.soknader.henter
        || state.ledetekster.henter
        || state.tilgang.henter;
    const hentingFeilet = state.ledetekster.hentingFeilet
        || state.tilgang.hentingFeilet;
    const hentingFeiletSykepengesoknader = state.sykepengesoknader.hentingFeilet;
    const hentingFeiletSoknader = state.soknader.hentingFeilet;
    const skalHenteSykepengesoknader = !state.sykepengesoknader.henter
        && !state.sykepengesoknader.hentingFeilet
        && !state.sykepengesoknader.hentet;
    const skalHenteSoknader = !state.soknader.henter
        && !state.soknader.hentingFeilet
        && !state.soknader.hentet;

    return {
        skalHenteSoknader,
        skalHenteSykepengesoknader,
        brukernavn: state.navbruker.data.navn,
        fnr: ownProps.params.fnr,
        henter,
        hentingFeilet: hentingFeilet
            || (hentingFeiletSykepengesoknader && hentingFeiletSoknader),
        hentingFeiletSykepengesoknader,
        hentingFeiletSoknader,
        ledetekster: state.ledetekster.data,
        sykepengesoknader: state.sykepengesoknader.data,
        soknader: state.soknader.data,
        tilgang: state.tilgang.data,
    };
}

const SykepengesoknaderContainer = connect(mapStateToProps, mapDispatchToProps)(SykepengesoknaderSide);
export default SykepengesoknaderContainer;
