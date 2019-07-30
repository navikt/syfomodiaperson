import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    Tidslinje,
    TIDSLINJE_TYPER,
    setHendelseData,
    hentTidslinjer,
    getLedetekst,
    getHtmlLedetekst,
} from '@navikt/digisyfo-npm';
import Side from '../sider/Side';
import SidetoppSpeilet from '../components/SidetoppSpeilet';
import * as sykeforloepActions from '../actions/sykeforloep_actions';
import Feilmelding from '../components/Feilmelding';
import AppSpinner from '../components/AppSpinner';
import Brodsmuler from '../components/Brodsmuler';
import Speilingvarsel from '../components/Speilingvarsel';
import TidslinjeVelgArbeidssituasjonContainer from '../containers/TidslinjeVelgArbeidssituasjonContainer';
import { TIDSLINJEN } from '../enums/menypunkter';
import { henterEllerHarHentetSykeforloep } from '../utils/reducerUtils';
import history from '../history';
import { hentBegrunnelseTekst } from '../utils/tilgangUtils';

export class TidslinjeSide extends Component {
    constructor(props) {
        super(props);
        this.endreArbeidssituasjon = this.endreArbeidssituasjon.bind(this);
        this.setHistoryListener();
    }

    componentWillMount() {
        const { actions, fnr, sykeforloep } = this.props;
        if (!henterEllerHarHentetSykeforloep(sykeforloep)) {
            actions.hentSykeforloep(fnr);
        }
    }

    componentWillReceiveProps(nextProps) {
        const { actions, apneHendelseIder, sykeforloep, arbeidssituasjon } = this.props;
        if (!sykeforloep.hentet && nextProps.sykeforloep.hentet) {
            actions.hentTidslinjer(apneHendelseIder, arbeidssituasjon, nextProps.sykeforloep.data);
        }
    }

    setHistoryListener() {
        history.listen((location) => {
            if (location && location.pathname.endsWith('/tidslinjen')) {
                this.endreArbeidssituasjon(TIDSLINJE_TYPER.MED_ARBEIDSGIVER);
            }
        });
    }

    endreArbeidssituasjon(arbeidssituasjon) {
        this.props.actions.hentTidslinjer([], arbeidssituasjon, this.props.sykeforloep.data);
    }

    render() {
        const {
            fnr,
            hendelser,
            ledetekster,
            actions,
            henter,
            hentingFeilet,
            brukernavn,
            tilgang,
            arbeidssituasjon,
        } = this.props;
        const htmlIntro = {
            __html: `<p>${getLedetekst('tidslinje.introtekst', ledetekster)}</p>`,
        };
        const brodsmuler = [{
            tittel: 'Ditt sykefravær',
        }, {
            tittel: 'Tidslinjen',
        }];
        return (<Side fnr={fnr} tittel="Tidslinje" aktivtMenypunkt={TIDSLINJEN}>
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
                    return (<div>
                        <Speilingvarsel brukernavn={brukernavn} />
                        <div className="speiling">
                            <Brodsmuler brodsmuler={brodsmuler} />
                            <SidetoppSpeilet tittel="Tidslinjen" htmlTekst={htmlIntro} />
                            <TidslinjeVelgArbeidssituasjonContainer
                                ledetekster={ledetekster}
                                hentTidslinjer={this.endreArbeidssituasjon}
                                endreUrl={history.replace}
                                valgtArbeidssituasjon={arbeidssituasjon}
                                rootUrl={`/sykefravaer/${this.props.fnr}`}
                            />
                            <Tidslinje
                                arbeidssituasjon={arbeidssituasjon}
                                hendelser={hendelser}
                                ledetekster={ledetekster}
                                setHendelseData={actions.setHendelseData}
                            />
                        </div>
                    </div>);
                })()
            }
        </Side>);
    }
}

TidslinjeSide.propTypes = {
    fnr: PropTypes.string,
    apneHendelseIder: PropTypes.array,
    arbeidssituasjon: PropTypes.string,
    actions: PropTypes.object,
    henter: PropTypes.bool,
    hentingFeilet: PropTypes.bool,
    tilgang: PropTypes.object,
    hendelser: PropTypes.array,
    ledetekster: PropTypes.object,
    brukernavn: PropTypes.string,
    sykeforloep: PropTypes.object,
};

export function mapDispatchToProps(dispatch) {
    const actions = Object.assign({},
        sykeforloepActions,
        { setHendelseData, hentTidslinjer });
    return {
        actions: bindActionCreators(actions, dispatch),
    };
}

export const mapArbeidssituasjonParam = (param) => {
    switch (param) {
        case 'uten-arbeidsgiver': {
            return 'UTEN_ARBEIDSGIVER';
        }
        case 'med-arbeidsgiver': {
            return 'MED_ARBEIDSGIVER';
        }
        case undefined: {
            return undefined;
        }
        default: {
            return 'MED_ARBEIDSGIVER';
        }
    }
};

export function setHash(hendelser) {
    const hendelserApne = hendelser
        .filter((m) => {
            return m.erApen;
        })
        .map((m) => {
            return m.id;
        })
        .join('/');

    window.history.replaceState(null, null, `#${hendelserApne}`);
}

export function mapStateToProps(state, ownProps) {
    let arbeidssituasjonParam = (ownProps && ownProps.params) ? ownProps.params.arbeidssituasjon : undefined;
    arbeidssituasjonParam = mapArbeidssituasjonParam(arbeidssituasjonParam);
    const arbeidssituasjon = arbeidssituasjonParam || 'MED_ARBEIDSGIVER';
    const hendelser = state.tidslinjer && state.tidslinjer.data && state.tidslinjer.data.length ? state.tidslinjer.data[0].hendelser : [];
    if (hendelser.length) {
        setHash(hendelser);
    }
    const apneHendelseIder = (ownProps && ownProps.location) ? ownProps.location.hash.replace('#', '').split('/') : [];

    const henter = state.ledetekster.henter
        || state.tilgang.henter
        || state.sykeforloep.henter;
    const hentingFeilet = state.ledetekster.hentingFeilet
        || state.tilgang.hentingFeilet
        || state.sykeforloep.hentingFeilet;
    return {
        arbeidssituasjon,
        brukernavn: state.navbruker.data.navn,
        sykeforloep: state.sykeforloep,
        fnr: ownProps.params.fnr,
        hendelser,
        apneHendelseIder,
        henter,
        hentingFeilet,
        tilgang: state.tilgang.data,
        ledetekster: state.ledetekster.data,
    };
}

const TidslinjeContainer = connect(mapStateToProps, mapDispatchToProps)(TidslinjeSide);
export default TidslinjeContainer;
