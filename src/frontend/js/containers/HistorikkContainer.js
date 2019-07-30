import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
    getLedetekst,
    getHtmlLedetekst,
} from '@navikt/digisyfo-npm';
import Side from '../sider/Side';
import Historikk from '../components/historikk/Historikk';
import Feilmelding from '../components/Feilmelding';
import AppSpinner from '../components/AppSpinner';
import * as historikkActions from '../actions/historikk_actions';
import * as sykeforloepActions from '../actions/sykeforloep_actions';
import { HISTORIKK } from '../enums/menypunkter';
import { hentBegrunnelseTekst } from '../utils/tilgangUtils';

export class HistorikkSide extends Component {
    constructor(props) {
        super(props);
        if (!props.historikk.henterMoter && !props.historikk.hentetMoter) {
            props.actions.hentHistorikk(this.props.fnr, 'MOTER');
        }
        if (!props.historikk.henterMotebehov && !props.historikk.hentetMotebehov) {
            props.actions.hentHistorikk(this.props.fnr, 'MOTEBEHOV');
        }
        if (!props.historikk.henterOppfoelgingsdialoger && !props.historikk.hentetOppfoelgingsdialoger) {
            props.actions.hentHistorikk(this.props.fnr, 'OPPFOELGINGSDIALOG');
        }
        if (!props.sykeforloep.henter && !props.sykeforloep.hentet) {
            props.actions.hentSykeforloep(this.props.fnr);
        }
    }

    render() {
        const {
            fnr,
            henter,
            hentingFeilet,
            historikk,
            ledetekster,
            sykeforloep,
            tilgang,
        } = this.props;
        return (<Side fnr={fnr} tittel="Historikk" aktivtMenypunkt={HISTORIKK}>
            {
                (() => {
                    if (henter) {
                        return <AppSpinner />;
                    } else if (!tilgang.harTilgang) {
                        return (<Feilmelding
                            tittel={getLedetekst('sykefravaer.veileder.feilmelding.tittel', ledetekster)}
                            melding={getHtmlLedetekst(hentBegrunnelseTekst(tilgang.begrunnelse), ledetekster)}
                        />);
                    } else if (hentingFeilet) {
                        return <Feilmelding />;
                    }
                    return <Historikk sykeforloep={sykeforloep.data} historikk={historikk} />;
                })()
            }
        </Side>);
    }
}

HistorikkSide.propTypes = {
    hentSykeforloep: PropTypes.func,
    hentHistorikk: PropTypes.func,
    historikk: PropTypes.object,
    sykeforloep: PropTypes.object,
    ledetekster: PropTypes.object,
    actions: PropTypes.object,
    fnr: PropTypes.string,
    hentet: PropTypes.bool,
    henter: PropTypes.bool,
    hentingFeilet: PropTypes.bool,
    tilgang: PropTypes.object,
};

export function mapDispatchToProps(dispatch) {
    const actions = Object.assign({}, historikkActions, sykeforloepActions);
    return {
        actions: bindActionCreators(actions, dispatch),
    };
}

export const mapStateToProps = (state, ownProps) => {
    return {
        fnr: ownProps.params.fnr,
        sykeforloep: state.sykeforloep,
        historikk: state.historikk,
        henter: state.sykeforloep.henter || state.ledetekster.henter || state.tilgang.henter,
        hentet: state.sykeforloep.hentet,
        ledetekster: state.ledetekster.data,
        hentingFeilet: state.sykeforloep.hentingFeilet || state.tilgang.hentingFeilet,
        tilgang: state.tilgang.data,
    };
};

const HistorikkContainer = connect(mapStateToProps, mapDispatchToProps)(HistorikkSide);

export default HistorikkContainer;
