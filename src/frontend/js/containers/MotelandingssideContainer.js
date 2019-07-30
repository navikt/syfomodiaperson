import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    getHtmlLedetekst,
    getLedetekst,
} from '@navikt/digisyfo-npm';
import Side from '../sider/Side';
import { MOETEPLANLEGGER } from '../enums/menypunkter';
import * as moterActions from '../actions/moter_actions';
import AppSpinner from '../components/AppSpinner';
import Feilmelding from '../components/Feilmelding';
import Motelandingsside from '../components/Motelandingsside';
import { hentBegrunnelseTekst } from '../utils/tilgangUtils';

export class MotelandingssideSide extends Component {
    componentDidMount() {
        const {
            hentMoter,
            fnr,
        } = this.props;
        hentMoter(fnr);
    }

    render() {
        const {
            fnr,
            henter,
            hentingFeilet,
            ledetekster,
            mote,
            tilgang,
        } = this.props;
        return (<Side fnr={fnr} tittel="Møtelandingsside" aktivtMenypunkt={MOETEPLANLEGGER}>
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
                    return (<Motelandingsside
                        fnr={fnr}
                        mote={mote}
                    />);
                })()
            }
        </Side>);
    }
}

MotelandingssideSide.propTypes = {
    fnr: PropTypes.string,
    henter: PropTypes.bool,
    hentingFeilet: PropTypes.bool,
    hentMoter: PropTypes.func,
    ledetekster: PropTypes.object,
    mote: PropTypes.object,
    tilgang: PropTypes.object,
};

export const mapStateToProps = (state, ownProps) => {
    const aktivtMote = state.moter.data.filter((mote) => {
        return mote.status !== 'AVBRUTT';
    })[0];

    return {
        fnr: ownProps.params.fnr,
        henter: state.tilgang.henter
        || state.ledetekster.henter
        || state.moter.henter,
        hentingFeilet: state.tilgang.hentingFeilet
        || state.ledetekster.hentingFeilet,
        ledetekster: state.ledetekster.data,
        mote: aktivtMote,
        tilgang: state.tilgang.data,
    };
};

const MotelandingssideContainer = connect(mapStateToProps, moterActions)(MotelandingssideSide);

export default MotelandingssideContainer;
