import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import AlertStripe from 'nav-frontend-alertstriper';
import { CONTEXT_EVENT_TYPE } from '../konstanter';
import {
    hentAktivBruker,
    hentAktivEnhet,
    pushModiaContext,
} from '../actions/modiacontext_actions';
import { valgtEnhet } from '../actions/enhet_actions';
import { hentVeilederinfo } from '../actions/veilederinfo_actions';
import { opprettWebsocketConnection } from './contextHolder';
import ModalWrapper from 'nav-frontend-modal';
import { Knapp } from 'nav-frontend-knapper';
import { config } from '../global';
import { isNullOrUndefined } from 'util';
import Lenke from 'nav-frontend-lenker';

const redirectTilNyBruker = (nyttFnr) => {
    window.location.href = `/sykefravaer/${nyttFnr}`;
};

const oppdaterAktivEnhet = (actions, nyEnhet) => {
    config.config.initiellEnhet = nyEnhet;
    actions.valgtEnhet(nyEnhet);
    if (window.renderDecoratorHead) {
        window.renderDecoratorHead(config);
    }
};

const opprettWSConnection = (veilederinfo, wsCallback) => {
    const ident = veilederinfo.data.ident;
    opprettWebsocketConnection(ident, wsCallback);
};

const tekster = {
    endretBrukerModal: {
        header: 'Du har endret bruker',
        beskrivelse: 'Du har allerede et vindu med Modia åpent. Hvis du fortsetter i dette vinduet vil du miste ulagret arbeid i det andre vinduet. Ønsker du å fortsette med dette vinduet?',
        beholdKnapp: 'Avbryt, jeg vil ikke miste ulagret arbeide',
        byttKnapp: 'Fortsett med ny bruker',
    },
    endretEnhetModal: {
        header: 'Du har endret enhet',
        beskrivelse: 'Du har allerede et vindu med Modia åpent. Hvis du fortsetter i dette vinduet vil du miste ulagret arbeid i det andre vinduet. Ønsker du å fortsette med dette vinduet?',
        beholdKnapp: 'Avbryt, jeg vil ikke miste ulagret arbeide',
        byttKnapp: 'Fortsett med ny enhet',
    },
};

const endretSideModal = (endretType, byttTilNyClickHandler, beholdGammelClickHandler) => {
    const modalTekster = endretType === 'bruker' 
        ? tekster.endretBrukerModal
        : tekster.endretEnhetModal;

    return (
        <ModalWrapper
            className="contextContainer__modal"
            closeButton={false}
            ariaHideApp={false}
            isOpen
            shouldFocusAfterRender
        >
            <div className="contextContainer__modal--innhold">
                <h2 className="contextContainer__modal--header">{modalTekster.header}</h2>
                <p>{modalTekster.beskrivelse}</p>
                <div className="divider"></div>
                <div className="contextContainer__modal--knapper">
                    <Knapp
                        autoFocus
                        tabIndex={1}
                        ariaLabel={`Behold gammel ${endretType}`}
                        onClick={() => {
                            beholdGammelClickHandler();
                        }}>
                        {modalTekster.beholdKnapp}
                    </Knapp>
                    <Knapp
                        className="lenke"
                        tabIndex={2}
                        ref={"byttLenke"}
                        ariaLabel={`Bytt til ny ${endretType}`}
                        onClick={() => {
                            byttTilNyClickHandler();
                        }}>
                        {modalTekster.byttKnapp}
                    </Knapp>
                </div>
            </div>
        </ModalWrapper>
    );
};

export class Context extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visEndretBrukerModal: false,
            visEndretEnhetModal: false,
            nyttFnr: undefined,
            nyEnhet: undefined,
        };
        this.onByttBrukerClicked = this.onByttBrukerClicked.bind(this);
        this.onByttEnhetClicked = this.onByttEnhetClicked.bind(this);
        this.beholdGammelBrukerClicked = this.beholdGammelBrukerClicked.bind(this);
        this.beholdGammelEnhetClicked = this.beholdGammelEnhetClicked.bind(this);
        this.skjulEndreModal = this.skjulEndreModal.bind(this);
    }

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
            opprettWSConnection(nextProps.veilederinfo, (wsCallback) => {
                if (wsCallback.data === CONTEXT_EVENT_TYPE.NY_AKTIV_BRUKER) {
                    actions.hentAktivBruker({
                        callback: (aktivBruker) => {
                            this.visEndretBrukerModal(aktivBruker);
                        },
                    });
                } else if (wsCallback.data === CONTEXT_EVENT_TYPE.NY_AKTIV_ENHET) {
                    actions.hentAktivEnhet({
                        callback: (aktivEnhet) => {
                            this.visEndretEnhetModal(aktivEnhet);
                        },
                    });
                }
            });
        }
    }

    onByttBrukerClicked() {
        redirectTilNyBruker(this.state.nyttFnr);
    }

    onByttEnhetClicked() {
        oppdaterAktivEnhet(this.props.actions, this.state.nyEnhet);
        this.skjulEndreModal();
    }

    skjulEndreModal() {
        this.setState({
            visEndretBrukerModal: false,
            visEndretEnhetModal: false,
            nyEnhet: undefined,
            nyttFnr: undefined,
            gammeltFnr: undefined,
            gammelEnhet: undefined,
        });
    }

    visEndretBrukerModal(nyttFnr) {
        const gammeltFnr = config.config.fnr;
        if (!isNullOrUndefined(nyttFnr) && gammeltFnr !== nyttFnr) {
            this.setState({
                visEndretBrukerModal: true,
                visEndretEnhetModal: false,
                nyttFnr,
                gammeltFnr,
            });
        }
    }

    visEndretEnhetModal(nyEnhet) {
        const gammelEnhet = config.config.initiellEnhet;
        if (!isNullOrUndefined(gammelEnhet) && gammelEnhet !== nyEnhet) {
            this.setState({
                visEndretBrukerModal: false,
                visEndretEnhetModal: true,
                nyEnhet,
                gammelEnhet,
            });
        }
    }

    beholdGammelEnhetClicked() {
        if (this.state.gammelEnhet) {
            oppdaterAktivEnhet(this.props.actions, this.state.gammelEnhet);
        }
        this.skjulEndreModal();
    }

    beholdGammelBrukerClicked() {
        const {
            actions,
        } = this.props;
        if (this.state.gammeltFnr) {
            actions.pushModiaContext({
                verdi: this.state.gammeltFnr,
                eventType: CONTEXT_EVENT_TYPE.NY_AKTIV_BRUKER,
            });
            this.setState({
                nyttFnr: undefined,
                gammeltFnr: undefined,
            });
        }
        this.skjulEndreModal();
    }

    render() {
        const {
            veilederinfo,
        } = this.props;

        const {
            visEndretBrukerModal,
            visEndretEnhetModal,
        } = this.state;
        return (<div className="contextContainer">
            {visEndretBrukerModal && endretSideModal('bruker', this.onByttBrukerClicked, this.beholdGammelBrukerClicked)}
            {visEndretEnhetModal && endretSideModal('enhet', this.onByttEnhetClicked, this.beholdGammelEnhetClicked)}
            {veilederinfo.hentingFeilet &&
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
        pushModiaContext,
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
