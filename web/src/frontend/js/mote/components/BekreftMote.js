import React, {PropTypes} from "react";
import {Link} from "react-router";
import {fikkMoteOpprettetVarsel} from "../utils/index";

const BekreftMote = ({ deltaker, sykmeldtDeltaker, onSubmit, avbrytHref }) => {
    return (<div className="epostinnhold">
        <h2 className="typo-innholdstittel">Send møteresultat</h2>

        <div className="epostinnhold__mottakere blokk">
            <h3>Sendes til arbeidsgiver</h3>
            <p>{deltaker.navn}</p>
        </div>

        { fikkMoteOpprettetVarsel(sykmeldtDeltaker) &&
        <div className="epostinnhold__mottakere blokk">
            <h3>Sendes til sykmeldt</h3>
            <p>{sykmeldtDeltaker.navn}</p>
        </div>
        }

        <div className="epostinnhold_infoboks">
            <p>*Partene blir informert at møteforespørselen blir avbrutt på e-post, sms og på nav.no</p>
        </div>

        <div className="knapperad">
            <button className="knapp blokk--s" onClick={onSubmit}>Send møteresultat</button>
            <p><Link to={avbrytHref}>Avbryt</Link></p>
        </div>
    </div>);
};

BekreftMote.propTypes = {
    deltaker: PropTypes.object,
    sykmeldtDeltaker: PropTypes.object,
    onSubmit: PropTypes.func,
    avbrytHref: PropTypes.string,
};

export default BekreftMote;
