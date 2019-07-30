import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import AlertStripe from 'nav-frontend-alertstriper';
import {
    getLedetekst,
    getHtmlLedetekst,
} from '@navikt/digisyfo-npm';
import * as moterPropTypes from '../../propTypes';
import { getDatoFraZulu, erMotePassert } from '../utils/index';
import Sidetopp from '../../components/Sidetopp';
import KontaktInfoFeilmelding from './KontaktInfoFeilmelding';
import BekreftetMotetidspunkt from './BekreftetMotetidspunkt';
import InformasjonSendt from './InformasjonSendt';
import FlereTidspunktSkjema from '../skjema/FlereTidspunktSkjema';
import Svarstatus from './Svarstatus';

export const MotetidspunktValgt = (
    {
        bekreftetTidspunkt,
        ledetekster,
    }) => {
    return <div className="motetidspunktValgt">{getLedetekst('mote.bookingstatus.valgt-sendt-til-parter', ledetekster, { '%TID%': getDatoFraZulu(bekreftetTidspunkt) })}</div>;
};

const BEKREFTET = 'BEKREFTET';
const OPPRETTET = 'OPPRETTET';
const FLERE_TIDSPUNKT = 'FLERE_TIDSPUNKT';
export const kvitteringTekst = {
    overskrift: 'Blir det sendt spørsmål om behov for møte til sykmeldt og nærmeste leder?',
    forUke16: 'Hvis du har brukt møteplanleggeren før uke 16: Spørsmålet om behov for møte vil ikke bli sendt ut.',
    etterUke16: 'Hvis du har sendt forslag til møtetidspunkt etter uke 16: Spørsmålet om behov forsvinner fra nav.no hvis de ikke har svart ennå.',
};

MotetidspunktValgt.propTypes = {
    bekreftetTidspunkt: PropTypes.string,
    ledetekster: PropTypes.object,
};

const getLedetekstFraFeilAarsak = (feilAarsak, ledetekster) => {
    let nokkel;
    switch (feilAarsak) {
        case 'RESERVERT': {
            nokkel = 'motestatus.krr.reservert';
            break;
        }
        case 'KONTAKTINFO_IKKE_FUNNET': {
            nokkel = 'motestatus.krr.ingen-kontaktinformasjon';
            break;
        }
        case 'INGEN_KONTAKTINFORMASJON': {
            nokkel = 'motestatus.krr.ingen-kontaktinformasjon';
            break;
        }
        case 'UTGAATT': {
            nokkel = 'motestatus.krr.utgaatt';
            break;
        }
        default: {
            nokkel = 'mote.krr.generell';
            break;
        }
    }
    return getHtmlLedetekst(nokkel, ledetekster);
};

const getSendtTilTekst = (mote, ledetekster, arbeidstaker) => {
    const navneliste = mote.deltakere
        .filter((deltaker) => {
            return deltaker.type === 'arbeidsgiver' || arbeidstaker.kontaktinfo.skalHaVarsel;
        })
        .map((deltaker) => {
            return deltaker.navn;
        });
    const nokkel = mote.status === OPPRETTET || mote.status === FLERE_TIDSPUNKT ? 'mote.bookingstatus.foresporsel.sendt.til' : 'mote.bookingstatus.bekreftet.sendt-til';
    return getLedetekst(nokkel, ledetekster, {
        '%DELTAKERE%': navneliste.join(' og '),
    });
};

const getSidetoppNokkel = (mote, motePassert) => {
    if (motePassert) {
        return 'mote.bookingstatus.passert.tittel';
    } else if (mote.status === OPPRETTET || mote.status === FLERE_TIDSPUNKT) {
        return 'mote.bookingstatus.sidetittel';
    }
    return 'mote.bookingstatus.bekreftet.tittel';
};

export const StatusVarsel = (
    {
        mote,
        ledetekster,
        arbeidstaker,
    }) => {
    const dato = (mote.status === OPPRETTET || mote.status === FLERE_TIDSPUNKT) ? mote.opprettetTidspunkt : mote.bekreftetAlternativ.created;
    return (<div className="panel statusVarsel">
        <AlertStripe type="suksess">
            <div className="panel">
                <p className="typo-element">{getSendtTilTekst(mote, ledetekster, arbeidstaker)}</p>
                <p className="sist">{getLedetekst('mote.bookingstatus.sendt-dato', ledetekster, {
                    '%DATO%': getDatoFraZulu(dato),
                })}</p>
            </div>
        </AlertStripe>
        <AlertStripe type="info">
            <div className="panel">
                <p className="typo-element">{kvitteringTekst.overskrift}</p>
                <p className="siste">{
                    <ul>
                        <li>{kvitteringTekst.forUke16}</li>
                        <li>{kvitteringTekst.etterUke16}</li>
                    </ul>
                }</p>
            </div>
        </AlertStripe>
    </div>);
};

StatusVarsel.propTypes = {
    mote: moterPropTypes.motePt,
    ledetekster: PropTypes.object,
    arbeidstaker: PropTypes.object,
};

export const PassertVarsel = ({ ledetekster }) => {
    return (
        <AlertStripe type="info">
            <div>
                <p className="typo-element">{getLedetekst('mote.bookingstatus.passert.varsel.tekst', ledetekster)}</p>
                <p className="sist">{getLedetekst('mote.bookingstatus.passert.varsel.undertekst', ledetekster)}</p>
            </div>
        </AlertStripe>);
};
PassertVarsel.propTypes = {
    ledetekster: PropTypes.object,
};

const MotebookingStatus = (props) => {
    const {
        ledetekster,
        fnr,
        mote,
        avbrytMoteUtenVarsel,
        skalViseFlereAlternativ,
        arbeidstaker,
    } = props;
    const { alternativer, status } = mote;
    const krrMeldingPanel = !arbeidstaker.kontaktinfo.skalHaVarsel ?
        <KontaktInfoFeilmelding melding={getLedetekstFraFeilAarsak(arbeidstaker.kontaktinfo.feilAarsak, ledetekster)} />
        : null;
    const motePassert = erMotePassert(mote);
    const flereTidspunktBoks = skalViseFlereAlternativ
        ? <FlereTidspunktSkjema {...props} antallEksisterendeTidspunkter={alternativer.length} />
        : null;
    const sidetoppNokkel = getSidetoppNokkel(mote, motePassert);
    const knapp = erMotePassert(mote)
        ? <button className="js-ny knapp" onClick={() => { avbrytMoteUtenVarsel(mote.moteUuid, fnr); }}>{getLedetekst('mote.bookingstatus.knapp.planlegg-nytt-mote', ledetekster)}</button>
        : <Link role="button" className="knapp knapp--enten js-avbryt" to={`/sykefravaer/${fnr}/mote/${mote.moteUuid}/avbryt`}>{getLedetekst('mote.bookingstatus.knapp.avbryt', ledetekster)}</Link>;

    return (<div>
        <Sidetopp tittel={getLedetekst(sidetoppNokkel, ledetekster)} />
        { !motePassert && <StatusVarsel
            mote={mote}
            ledetekster={ledetekster}
            arbeidstaker={arbeidstaker}
        /> }
        {krrMeldingPanel}
        <div className="panel">
            { status === BEKREFTET && <BekreftetMotetidspunkt {...props} /> }
            { status !== BEKREFTET && !motePassert && <Svarstatus {...props}>{flereTidspunktBoks}</Svarstatus> }
            { status !== BEKREFTET && motePassert && <PassertVarsel ledetekster={ledetekster} /> }
            <div className="motested">
                <h3 className="motested__tittel">{getLedetekst('mote.bookingstatus.sted', ledetekster)}</h3>
                <p className="motested__sted">{mote.alternativer[0].sted}</p>
            </div>
            { status === BEKREFTET && !motePassert && <InformasjonSendt {...props} /> }
            <div className="knapperad">
                {knapp}
            </div>
        </div>
    </div>);
};

MotebookingStatus.propTypes = {
    mote: moterPropTypes.motePt,
    antallNyeTidspunkt: PropTypes.number,
    fnr: PropTypes.string,
    arbeidstaker: PropTypes.object,
    senderNyeAlternativ: PropTypes.bool,
    nyeAlternativFeilet: PropTypes.bool,
    fikkIkkeOpprettetVarsel: PropTypes.object,
    ledetekster: PropTypes.object,
    avbrytMoteUtenVarsel: PropTypes.func,
    flereAlternativ: PropTypes.func,
    opprettFlereAlternativ: PropTypes.func,
    avbrytFlereAlternativ: PropTypes.func,
    skalViseFlereAlternativ: PropTypes.bool,
};

export default MotebookingStatus;
