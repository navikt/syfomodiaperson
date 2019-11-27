import React from 'react';
import PropTypes from 'prop-types';
import EtikettBase from 'nav-frontend-etiketter';
import {
    formaterFnr,
    hentBrukersAlderFraFnr,
    hentBrukersKjoennFraFnr,
} from '../../utils/fnrUtils';
import { KJOENN } from '../../konstanter';

const PersonkortHeader = ({ diskresjonskode, egenansatt, navbruker }) => {
    const visEtiketter = diskresjonskode.data.diskresjonskode === '6'
        || diskresjonskode.data.diskresjonskode === '7'
        || egenansatt.data.erEgenAnsatt;

    const isItChristmasTime = new Date().getMonth() === 11; // december

    const mann = isItChristmasTime
        ? '/sykefravaer/img/png/pepperkakemann.png'
        : '/sykefravaer/img/svg/mann.svg';
    const kvinne = isItChristmasTime
        ? '/sykefravaer/img/png/pepperkadame.png'
        : '/sykefravaer/img/svg/kvinne.svg';

    const tittelImg = hentBrukersKjoennFraFnr(navbruker.kontaktinfo.fnr) === KJOENN.KVINNE
        ? kvinne
        : mann;

    return (<div className="personkortHeader">
        <div className="personkortHeader__info">
            <img src={tittelImg} alt="person" />
            <div>
                <h3>{`${navbruker.navn ? navbruker.navn : ''} (${hentBrukersAlderFraFnr(navbruker.kontaktinfo.fnr)} år)`}</h3>
                <p>{formaterFnr(navbruker.kontaktinfo.fnr)}</p>
            </div>
        </div>
        {
            visEtiketter && <div className="personkortHeader__etikker">
                {
                    diskresjonskode.data.diskresjonskode === '6'
                    && (<EtikettBase type="fokus">Kode 6</EtikettBase>)
                }
                {
                    diskresjonskode.data.diskresjonskode === '7'
                    && (<EtikettBase type="fokus">Kode 7</EtikettBase>)
                }
                {
                    egenansatt.data.erEgenAnsatt
                    && <EtikettBase type="fokus">Egen ansatt</EtikettBase>
                }
            </div>
        }
    </div>);
};

PersonkortHeader.propTypes = {
    egenansatt: PropTypes.object,
    diskresjonskode: PropTypes.object,
    navbruker: PropTypes.object,
};

export default PersonkortHeader;
