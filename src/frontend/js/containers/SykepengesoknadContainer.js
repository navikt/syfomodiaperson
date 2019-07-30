import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    getLedetekst,
    getHtmlLedetekst,
    sykmelding as sykmeldingPt,
} from '@navikt/digisyfo-npm';
import Side from '../sider/Side';
import * as sykepengesoknaderActions from '../actions/sykepengesoknader_actions';
import * as soknaderActions from '../actions/soknader_actions';
import * as sykmeldingerActions from '../actions/sykmeldinger_actions';
import Feilmelding from '../components/Feilmelding';
import AppSpinner from '../components/AppSpinner';
import { SYKEPENGESOKNADER } from '../enums/menypunkter';
import {
    sykepengesoknad as sykepengesoknadPt,
    soknad as soknadPt,
} from '../propTypes';
import { hentBegrunnelseTekst } from '../utils/tilgangUtils';
import { erDev } from '../selectors/toggleSelectors';
import SykepengesoknadArbeidstaker from '../components/sykepengesoknad-arbeidstaker/SykepengesoknadArbeidstaker';
import {
    ARBEIDSTAKERE,
    OPPHOLD_UTLAND,
    SELVSTENDIGE_OG_FRILANSERE,
} from '../enums/soknadtyper';
import SykepengesoknadSelvstendig from '../components/sykepengesoknad-selvstendig/SykepengesoknadSelvstendig';
import SykepengesoknadUtland from '../components/sykepengesoknad-utland/SykepengesoknadUtland';
import SendtSoknadArbeidstakerNy from '../components/sykepengesoknad-arbeidstaker-ny/SendtSoknadArbeidstakerNy';
import {
    AVBRUTT,
    KORRIGERT,
    SENDT,
} from '../enums/soknadstatuser';
import IkkeInnsendtSoknad from '../components/sykepengesoknad-felles/IkkeInnsendtSoknad';
import AvbruttSoknadArbeidtakerNy from '../components/sykepengesoknad-arbeidstaker-ny/AvbruttSoknadArbeidtakerNy';

export class Container extends Component {
    componentWillMount() {
        const { fnr } = this.props;
        if (this.props.skalHenteSykepengesoknader) {
            this.props.actions.hentSykepengesoknader(fnr);
        }
        if (this.props.skalHenteSoknader) {
            this.props.actions.hentSoknader(fnr);
        }
        if (this.props.skalHenteSykmeldinger) {
            this.props.actions.hentSykmeldinger(fnr);
        }
    }

    render() {
        const {
            brukernavn,
            ledetekster,
            henter,
            hentingFeilet,
            tilgang,
            sykepengesoknad,
            soknad,
            fnr,
            sykmelding,
        } = this.props;
        const brodsmuler = [{
            tittel: 'Ditt sykefravær',
        }, {
            tittel: 'Søknad om sykepenger',
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
                    if (sykepengesoknad) {
                        return (<SykepengesoknadArbeidstaker
                            fnr={fnr}
                            brodsmuler={brodsmuler}
                            brukernavn={brukernavn}
                            sykmelding={sykmelding}
                            sykepengesoknad={sykepengesoknad} />);
                    }
                    if (soknad && soknad.soknadstype === SELVSTENDIGE_OG_FRILANSERE) {
                        return (<SykepengesoknadSelvstendig
                            fnr={fnr}
                            brodsmuler={brodsmuler}
                            brukernavn={brukernavn}
                            sykmelding={sykmelding}
                            soknad={soknad} />);
                    }
                    if (soknad && soknad.soknadstype === OPPHOLD_UTLAND) {
                        return (<SykepengesoknadUtland
                            fnr={fnr}
                            brodsmuler={brodsmuler}
                            brukernavn={brukernavn}
                            soknad={soknad} />);
                    }
                    if (soknad && soknad.soknadstype === ARBEIDSTAKERE) {
                        return soknad.status === SENDT || soknad.status === KORRIGERT
                            ? (<SendtSoknadArbeidstakerNy
                                fnr={fnr}
                                brodsmuler={brodsmuler}
                                brukernavn={brukernavn}
                                soknad={soknad} />)
                            : soknad.status === AVBRUTT
                                ? <AvbruttSoknadArbeidtakerNy
                                    fnr={fnr}
                                    brodsmuler={brodsmuler}
                                    brukernavn={brukernavn}
                                    soknad={soknad} />
                                : <IkkeInnsendtSoknad fnr={fnr} />;
                    }
                    return <Feilmelding />;
                })()
            }
        </Side>);
    }
}

Container.propTypes = {
    sykepengesoknad: sykepengesoknadPt.isRequired,
    fnr: PropTypes.string,
    brukernavn: PropTypes.string,
    actions: PropTypes.object,
    henter: PropTypes.bool,
    hentingFeilet: PropTypes.bool,
    tilgang: PropTypes.object,
    ledetekster: PropTypes.object,
    skalHenteSykepengesoknader: PropTypes.bool,
    skalHenteSoknader: PropTypes.bool,
    skalHenteSykmeldinger: PropTypes.bool,
    soknad: soknadPt,
    sykmelding: sykmeldingPt,
};

export function mapDispatchToProps(dispatch) {
    const actions = Object.assign({}, sykepengesoknaderActions, soknaderActions, sykmeldingerActions);
    return {
        actions: bindActionCreators(actions, dispatch),
    };
}

export function mapStateToProps(state, ownProps) {
    const henter = state.sykepengesoknader.henter
        || state.soknader.henter
        || state.ledetekster.henter
        || state.tilgang.henter;
    const hentingFeilet = state.ledetekster.hentingFeilet
        || state.tilgang.hentingFeilet;
    const skalHenteSykepengesoknader = !state.sykepengesoknader.henter
        && !state.sykepengesoknader.hentingFeilet
        && !state.sykepengesoknader.hentet;
    const skalHenteSoknader = !state.soknader.henter
        && !state.soknader.hentingFeilet
        && !state.soknader.hentet;
    const skalHenteSykmeldinger = !state.sykmeldinger.henter
        && !state.sykmeldinger.hentingFeilet
        && !state.sykmeldinger.hentet;
    const sykepengesoknad = state.sykepengesoknader.data.find((s) => {
        return s.id === ownProps.params.sykepengesoknadId;
    });
    const soknad = state.soknader.data.find((s) => {
        return s.id === ownProps.params.sykepengesoknadId;
    });
    const sykmelding = state.sykmeldinger.data.find((sykmld) => {
        return sykepengesoknad
            ? sykmld.id === sykepengesoknad.sykmeldingId
            : soknad
                ? sykmld.id === soknad.sykmeldingId
                : false;
    });

    return {
        skalHenteSykepengesoknader,
        skalHenteSoknader,
        skalHenteSykmeldinger,
        brukernavn: state.navbruker.data.navn,
        fnr: ownProps.params.fnr,
        henter,
        hentingFeilet,
        ledetekster: state.ledetekster.data,
        tilgang: state.tilgang.data,
        sykepengesoknad,
        soknad,
        sykmelding,
    };
}

const SykepengesoknadContainer = connect(mapStateToProps, mapDispatchToProps)(Container);
export default SykepengesoknadContainer;
