import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as moterPropTypes from '../propTypes';
import Side from '../sider/Side';
import MotestatusContainer from './MotestatusContainer';
import * as moterActions from '../actions/moter_actions';
import Lightbox from '../components/Lightbox';
import history from '../history';
import BekreftMote from '../mote/components/BekreftMote';
import Feilmelding from '../components/Feilmelding';
import AppSpinner from '../components/AppSpinner';
import * as epostinnholdActions from '../actions/epostinnhold_actions';
import { MOETEPLANLEGGER } from '../enums/menypunkter';

export class BekreftMoteSide extends Component {
    constructor(props) {
        super(props);
        this.hentInnhold();
        this.state = {
            bekreftet: false,
            scrollOverflowY: false,
        };
        this.bekreftMote = this.bekreftMote.bind(this);
    }

    onSubmit() {
        const { bekreftMote, alternativ, mote, fnr } = this.props;
        bekreftMote(mote.moteUuid, alternativ.id, fnr);
    }

    hentInnhold() {
        const { alternativ, hentMoter, fnr } = this.props;
        if (!alternativ) {
            hentMoter(fnr);
        }
    }

    bekreftMote() {
        this.setState({
            bekreftet: true,
            scrollOverflowY: true,
        });
    }

    render() {
        const {
            alternativ,
            henterMoterBool,
            fnr,
            mote,
            ledetekster,
            bekrefter,
            bekreftFeilet,
            hentBekreftMoteEpostinnhold,
            arbeidstaker,
        } = this.props;
        return (<Side fnr={fnr} tittel="Bekreft møte" aktivtMenypunkt={MOETEPLANLEGGER}>
            {
                (() => {
                    if (henterMoterBool) {
                        return <AppSpinner />;
                    } else if (alternativ) {
                        return (<div>
                            { (mote.status === 'OPPRETTET' || mote.status === 'FLERE_TIDSPUNKT') &&
                                <Lightbox
                                    scrollOverflowY={this.state.scrollOverflowY}
                                    onClose={() => {
                                        history.replace(`/sykefravaer/${fnr}/mote`);
                                    }}>
                                    {
                                        (() => {
                                            return (<BekreftMote
                                                onSubmit={() => {
                                                    this.onSubmit();
                                                }}
                                                mote={mote}
                                                arbeidstaker={arbeidstaker}
                                                alternativ={alternativ}
                                                ledetekster={ledetekster}
                                                avbrytHref={`/sykefravaer/${fnr}/mote`}
                                                bekrefter={bekrefter}
                                                hentEpostinnhold={(moteUuid) => {
                                                    hentBekreftMoteEpostinnhold(moteUuid, alternativ.id);
                                                }}
                                                bekreftFeilet={bekreftFeilet}
                                                bekreftMote={this.bekreftMote}
                                                moteBekreftet={this.state.bekreftet}
                                            />);
                                        })()
                                    }
                                </Lightbox>
                            }
                            <MotestatusContainer moteUuid={mote.moteUuid} />
                        </div>);
                    }
                    return <Feilmelding />;
                })()
            }
        </Side>);
    }
}

BekreftMoteSide.propTypes = {
    bekrefter: PropTypes.bool,
    bekreftFeilet: PropTypes.bool,
    arbeidstaker: PropTypes.object,
    alternativ: PropTypes.object,
    henterMoterBool: PropTypes.bool,
    ledetekster: PropTypes.object,
    fnr: PropTypes.string,
    mote: moterPropTypes.motePt,
    hentMoter: PropTypes.func,
    hentBekreftMoteEpostinnhold: PropTypes.func,
    bekreftMote: PropTypes.func,
};

export const getMoteFraAlternativId = (moter, alternativId) => {
    if (!moter) {
        return null;
    }
    return moter.filter((mote) => {
        if (!mote.alternativer) {
            return false;
        }
        const alternativer = mote.alternativer.filter((alternativ) => {
            return `${alternativ.id}` === alternativId;
        });
        return alternativer.length > 0;
    })[0];
};

export const mapStateToProps = (state, ownProps) => {
    const alternativId = ownProps.params.alternativId;
    const mote = getMoteFraAlternativId(state.moter.data, alternativId);
    const alternativ = mote ? mote.alternativer.filter((alt) => {
        const id = `${alt.id}`;
        return id === `${alternativId}`;
    })[0] : null;
    return {
        fnr: ownProps.params.fnr,
        bekrefter: state.moter.bekrefter,
        bekreftFeilet: state.moter.bekreftFeilet,
        henterMoterBool: state.moter.henter || state.ledetekster.henter || state.navbruker.henter,
        ledetekster: state.ledetekster.data,
        arbeidstaker: state.navbruker.data,
        alternativ,
        mote,
    };
};

const BekreftMoteContainer = connect(mapStateToProps, Object.assign({}, moterActions, epostinnholdActions))(BekreftMoteSide);

export default BekreftMoteContainer;
