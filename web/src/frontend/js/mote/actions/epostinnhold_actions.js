import { HENT_BEKREFT_MOTE_EPOSTINNHOLD_FORESPURT, HENTER_EPOSTINNHOLD, EPOSTINNHOLD_HENTET, HENT_EPOSTINNHOLD_FEILET, HENT_AVBRYT_MOTE_EPOSTINNHOLD_FORESPURT, SET_VALGT_DELTAKER, SET_VALGT_KANAL } from './actiontyper';

export const hentBekreftMoteEpostinnhold = (motedeltakerUuid, valgtKanal, valgtAlternativId) => {
    return {
        type: HENT_BEKREFT_MOTE_EPOSTINNHOLD_FORESPURT,
        motedeltakerUuid,
        valgtKanal,
        valgtAlternativId,
    };
};

export const hentAvbrytMoteEpostinnhold = (motedeltakerUuid, valgtKanal) => {
    return {
        type: HENT_AVBRYT_MOTE_EPOSTINNHOLD_FORESPURT,
        motedeltakerUuid,
        valgtKanal,
    };
};

export const henterEpostInnhold = () => {
    return {
        type: HENTER_EPOSTINNHOLD,
    };
};

export const epostInnholdHentet = (eposttype, data) => {
    return {
        type: EPOSTINNHOLD_HENTET,
        eposttype,
        data,
    };
};

export const hentEpostinnholdFeilet = () => {
    return {
        type: HENT_EPOSTINNHOLD_FEILET,
    };
};

export const setValgtDeltaker = (valgtDeltaker) => {
    return {
        type: SET_VALGT_DELTAKER,
        valgtDeltaker,
    };
};

export const setValgtKanal = (valgtKanal) => {
    return {
        type: SET_VALGT_KANAL,
        valgtKanal,
    };
};
