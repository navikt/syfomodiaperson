import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import AlertStripe from 'nav-frontend-alertstriper';
import { CONTEXT_EVENT_TYPE } from '../konstanter';
import {
    hentAktivBruker,
    hentAktivEnhet,
} from '../actions/modiacontext_actions';
import { valgtEnhet } from '../actions/enhet_actions';
import { hentVeilederinfo } from '../actions/veilederinfo_actions';
import { opprettWebsocketConnection } from './contextHolder';

const opprettWSConnection = (actions, veilederinfo) => {
    const config = require('../index').config;
    const ident = veilederinfo.data.ident;
    opprettWebsocketConnection(ident, (wsCallback) => {
        if (wsCallback.data === CONTEXT_EVENT_TYPE.NY_AKTIV_BRUKER) {
            actions.hentAktivBruker({
                callback: (aktivBruker) => {
                    if (aktivBruker !== config.config.fnr) {
                        window.location.href = `/sykefravaer/${aktivBruker}`;
                    }
                },
            });
        } else if (wsCallback.data === CONTEXT_EVENT_TYPE.NY_AKTIV_ENHET) {
            actions.hentAktivEnhet({
                callback: (aktivEnhet) => {
                    if (aktivEnhet !== config.config.initiellEnhet) {
                        actions.valgtEnhet(aktivEnhet);
                        config.config.initiellEnhet = aktivEnhet;
                        window.renderDecoratorHead(config);
                    }
                },
            });
        }
    });
};

export class Context extends Component {
    componentDidMount() {
        const {
            actions,
            skalHenteVeilederinfo,
        } = this.props;
        if (skalHenteVeilederinfo) {
            actions.hentVeilederinfo();
        }
    }
    componentWillReceiveProps(nextProps) {
        const {
            actions,
            veilederinfo,
        } = this.props;

        if (!veilederinfo.hentet && nextProps.veilederinfo.hentet) {
            opprettWSConnection(actions, nextProps.veilederinfo);
        }
    }

    render() {
        const {
            veilederinfo,
        } = this.props;

        return (<div className="contextContainer">
            { veilederinfo.hentingFeilet &&
                <AlertStripe
                    className="contextContainer__alertstripe"
                    type="advarsel">
                    <div dangerouslySetInnerHTML={{ __html: '<p>Det skjedde en feil: Vi fant ikke din ident</p>' }} />
                </AlertStripe>
            }
        </div>);
    }
}

Context.propTypes = {
    actions: PropTypes.object,
    veilederinfo: PropTypes.object,
    skalHenteVeilederinfo: PropTypes.bool,
};

export function mapDispatchToProps(dispatch) {
    const actions = Object.assign({}, {
        hentAktivBruker,
        hentAktivEnhet,
        hentVeilederinfo,
        valgtEnhet,
    });
    return {
        actions: bindActionCreators(actions, dispatch),
    };
}

export function mapStateToProps(state) {
    const veilederinfo = state.veilederinfo;
    const skalHenteVeilederinfo = !(veilederinfo.henter || veilederinfo.hentet || veilederinfo.hentingFeilet);
    return {
        veilederinfo,
        skalHenteVeilederinfo,
    };
}

const ContextContainer = connect(mapStateToProps, mapDispatchToProps)(Context);

export default ContextContainer;
