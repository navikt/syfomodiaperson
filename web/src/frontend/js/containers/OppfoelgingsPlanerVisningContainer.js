import React, { Component, PropTypes } from 'react';
import Side from '../sider/Side';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getLedetekst, getHtmlLedetekst } from 'digisyfo-npm';
import * as oppdialogActions from '../actions/oppfoelgingsdialoger_actions';
import Feilmelding from '../components/Feilmelding';
import OppfoelgingsplanVisning from '../components/oppfoelgingsdialoger/OppfoelgingsplanVisning';
import AppSpinner from '../components/AppSpinner';
import { OPPFOELGINGSPLANER } from '../menypunkter';

export class OppfoelgingsPlanerVisningSide extends Component {
    componentWillMount() {
        const { fnr, actions, henterDialoger, hentetDialoger } = this.props;
        if (!henterDialoger && !hentetDialoger) {
            actions.hentOppfoelgingsdialoger(fnr);
        }
    }

    render() {
        const { oppfoelgingsdialog, ledetekster, henter, hentingFeilet, ikkeTilgang, fnr, ikkeTilgangFeilmelding, versjonertOppfoelgingsdialog } = this.props;

        return (<Side tittel="Oppfølgingsplaner" aktivtMenypunkt={OPPFOELGINGSPLANER}>
            {
                (() => {
                    if (henter) {
                        return <AppSpinner />;
                    }
                    if (ikkeTilgang) {
                        return (<Feilmelding tittel={getLedetekst('sykefravaer.veileder.feilmelding.tittel', ledetekster)}
                                             melding={getHtmlLedetekst(ikkeTilgangFeilmelding, ledetekster)} />);
                    }
                    if (hentingFeilet) {
                        return <Feilmelding />;
                    }
                    return (<div>
                       <OppfoelgingsplanVisning oppfoelgingsdialog={oppfoelgingsdialog} versjonertOppfoelgingsdialog={versjonertOppfoelgingsdialog} ledetekster={ledetekster} fnr={fnr}  />
                    </div>);
                })()
            }
        </Side>);
    }
}

OppfoelgingsPlanerVisningSide.propTypes = {
    fnr: PropTypes.string,
    ikkeTilgangFeilmelding: PropTypes.string,
    actions: PropTypes.object,
    oppfoelgingsdialog: PropTypes.object,
    versjonertOppfoelgingsdialog: PropTypes.object,
    henter: PropTypes.bool,
    hentingFeilet: PropTypes.bool,
    ikkeTilgang: PropTypes.bool,
    ledetekster: PropTypes.object,
};

export function mapDispatchToProps(dispatch) {
    const actions = Object.assign({}, oppdialogActions);
    return {
        actions: bindActionCreators(actions, dispatch),
    };
}

export function mapStateToProps(state, ownParams) {
    const fnr = state.navbruker.data.fnr;
    const henter = state.oppfoelgingsdialoger.henter || state.ledetekster.henter || state.ledere.henter;
    const hentingFeilet = state.oppfoelgingsdialoger.hentingFeilet || state.ledetekster.hentingFeilet || state.ledere.hentingFeilet;

    const oppfoelgingsdialog = state.oppfoelgingsdialoger.data.filter((oppfoelgingsdialog) => {
        return oppfoelgingsdialog.virksomhetsnummer === ownParams.params.virksomhetsnummer
            && oppfoelgingsdialog.oppfoelgingsdialogId == ownParams.params.oppfoelgingsdialogId;
    })[0];

    const versjonertOppfoelgingsdialog = oppfoelgingsdialog && oppfoelgingsdialog.versjonerteOppfoelgingsdialoger.filter((versjonertOppfoelgingsdialog) => {
        return versjonertOppfoelgingsdialog.versjon == ownParams.params.versjon;
    })[0];

    const hentetDialoger = state.oppfoelgingsdialoger.hentet;
    const henterDialoger = state.oppfoelgingsdialoger.henter;

    return {
        brukernavn: state.navbruker.data.navn,
        fnr,
        henter,
        hentingFeilet,
        hentetDialoger,
        henterDialoger,
        ledetekster: state.ledetekster.data,
        oppfoelgingsdialog,
        ikkeTilgang: state.ledere.ikkeTilgang,
        ikkeTilgangFeilmelding: state.ledere.ikkeTilgangFeilmelding,
        versjonertOppfoelgingsdialog,
    };
}

const OppfoelgingsPlanerVisningContainer = connect(mapStateToProps, mapDispatchToProps)(OppfoelgingsPlanerVisningSide);
export default OppfoelgingsPlanerVisningContainer;
