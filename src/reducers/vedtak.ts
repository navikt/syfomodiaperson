import {
    HENT_VEDTAK_FEILET,
    HENT_VEDTAK_HENTER,
    HENT_VEDTAK_HENTET
} from '../actions/vedtak_actions';

export interface Vedtak {
    id: String,
    lest: Boolean,
    vedtak: {
        fom: Date,
        tom: Date,
        forbrukteSykedager: number,
        gjenståendeSykedager: number,
        automatiskBehandling: boolean,
        utbetalinger: Utbetaling[]
    },
    opprettet: Date
}

export interface Utbetaling {
    mottaker: string,
    fagomrade: string,
    totalbeløp: number,
    utbetalingslinjer: Utbetalingslinje[]
}

export interface Utbetalingslinje {
    fom: Date,
    tom: Date,
    dagsats: number,
    beløp: number,
    grad: number,
    sykedager: number
}

export interface VedtakState {
    henter: boolean,
    hentingFeilet: boolean,
    hentet: boolean,
    hentingForsokt: boolean,

    data: Vedtak[] | null,
}

export const initialState: VedtakState = {
    henter: false,
    hentingFeilet: false,
    hentet: false,
    hentingForsokt: false,
    data: null,
};


const vedtak = (state = initialState, action = { type: '', data: [] }) => {
    switch (action.type) {
        case HENT_VEDTAK_HENTER: {
            return {
                ...state,
                henter: true,
                hentingFeilet: false,
                hentet: false,
            };
        }
        case HENT_VEDTAK_HENTET: {
            return {
                ...state,
                henter: false,
                hentingFeilet: false,
                hentet: true,
                hentingForsokt: true,
                data: action.data,
            };
        }
        case HENT_VEDTAK_FEILET: {
            return {
                ...state,
                henter: false,
                hentingFeilet: true,
                hentingForsokt: true,
                hentet: false,
            };
        }
        default:
            return state;
    }
};

export default vedtak;
