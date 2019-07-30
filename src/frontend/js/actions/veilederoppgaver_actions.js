import * as actionstype from './actiontyper';

export const HENT_VEILEDEROPPGAVER_FORESPURT = 'HENT_VEILEDEROPPGAVER_FORESPURT';
export const HENTER_VEILEDEROPPGAVER = 'HENTER_VEILEDEROPPGAVER';
export const HENT_VEILEDEROPPGAVER_FEILET = 'HENT_VEILEDEROPPGAVER_FEILET';
export const VEILEDEROPPGAVER_HENTET = 'VEILEDEROPPGAVER_HENTET';

export function hentVeilederOppgaverFeilet() {
    return {
        type: HENT_VEILEDEROPPGAVER_FEILET,
    };
}

export function henterVeilederOppgaver() {
    return {
        type: HENTER_VEILEDEROPPGAVER,
    };
}

export function veilederOppgaverHentet(data) {
    return {
        type: VEILEDEROPPGAVER_HENTET,
        data,
    };
}

export function hentVeilederOppgaver(fnr) {
    return {
        type: HENT_VEILEDEROPPGAVER_FORESPURT,
        fnr,
    };
}


export function oppgaveBehandletFeilet() {
    return {
        type: actionstype.BEHANDLE_OPPGAVE_FEILET,
    };
}

export function behandlerOppgave() {
    return {
        type: actionstype.BEHANDLER_OPPGAVE,
    };
}

export function oppgaveBehandlet(id, oppgave) {
    return {
        type: actionstype.OPPGAVE_BEHANDLET,
        id,
        oppgave,
    };
}

export function alleSvarMottattOppgaveBehandlet() {
    return {
        type: actionstype.ALLE_SVAR_MOTTATT_OPPGAVE_BEHANDLET,
    };
}

export function behandleOppgave(id, oppgave, fnr) {
    return {
        type: actionstype.BEHANDLE_OPPGAVE_FORESPURT,
        fnr,
        id,
        oppgave,
    };
}
