import * as actions from "./actiontyper";

export function opprettMote(data) {
  return {
    type: actions.OPPRETT_MOTE_FORESPURT,
    data,
  };
}

export function oppretterMote() {
  return {
    type: actions.OPPRETTER_MOTE,
  };
}

export function moteOpprettet(data) {
  return {
    type: actions.MOTE_OPPRETTET,
    fnr: data.fnr,
    data,
  };
}

export function opprettMoteFeilet() {
  return {
    type: actions.OPPRETT_MOTE_FEILET,
  };
}

export function hentMoter(fnr) {
  return {
    type: actions.HENT_MOTER_FORESPURT,
    fnr,
  };
}

export function henterMoter() {
  return {
    type: actions.HENTER_MOTER,
  };
}

export function moterHentet(data) {
  return {
    type: actions.MOTER_HENTET,
    data,
  };
}

export function hentMoterFeilet() {
  return {
    type: actions.HENT_MOTER_FEILET,
  };
}

export function hentMoterIkkeTilgang(tilgang) {
  return {
    type: actions.HENT_MOTER_IKKE_TILGANG,
    tilgang,
  };
}

export function avbrytMote(uuid, fnr) {
  return {
    type: actions.AVBRYT_MOTE_FORESPURT,
    uuid,
    fnr,
    varsle: true,
  };
}

export function avbrytMoteUtenVarsel(uuid, fnr) {
  return {
    type: actions.AVBRYT_MOTE_FORESPURT,
    uuid,
    fnr,
    varsle: false,
  };
}

export function flereAlternativ() {
  return {
    type: actions.FLERE_ALTERNATIV,
  };
}

export function fjernAlternativ() {
  return {
    type: actions.FJERN_ALTERNATIV,
  };
}

export function visFlereAlternativ() {
  return {
    type: actions.VIS_FLERE_ALTERNATIV,
  };
}

export function avbrytFlereAlternativ() {
  return {
    type: actions.AVBRYT_FLERE_ALTERNATIV,
  };
}

export function opprettFlereAlternativBekreftet(data, moteUuid) {
  return {
    type: actions.OPPRETT_FLERE_ALTERNATIV_BEKREFTET,
    data,
    moteUuid,
  };
}

export function opprettFlereAlternativ(data, moteUuid, fnr) {
  return {
    type: actions.OPPRETT_FLERE_ALTERNATIV_FORESPURT,
    data,
    moteUuid,
    fnr,
  };
}

export function opprettFlereAlternativFeilet() {
  return {
    type: actions.OPPRETT_FLERE_ALTERNATIV_FEILET,
  };
}

export function oppretterFlereAlternativ() {
  return {
    type: actions.OPPRETTER_FLERE_ALTERNATIV,
  };
}

export function moteAvbrutt(uuid) {
  return {
    type: actions.MOTE_AVBRUTT,
    uuid,
  };
}

export function avbrytMoteFeilet() {
  return {
    type: actions.AVBRYT_MOTE_FEILET,
  };
}

export function avbryterMote(uuid) {
  return {
    type: actions.AVBRYTER_MOTE,
    uuid,
  };
}

export function bekreftMote(moteUuid, valgtAlternativId, fnr) {
  return {
    type: actions.BEKREFT_MOTE_FORESPURT,
    moteUuid,
    valgtAlternativId,
    fnr,
  };
}

export function bekrefterMote() {
  return {
    type: actions.BEKREFTER_MOTE,
  };
}

export function moteBekreftet(moteUuid, valgtAlternativId, bekreftetTidspunkt) {
  return {
    type: actions.MOTE_BEKREFTET,
    moteUuid,
    valgtAlternativId,
    bekreftetTidspunkt,
  };
}

export function bekreftMoteFeilet() {
  return {
    type: actions.BEKREFT_MOTE_FEILET,
  };
}
