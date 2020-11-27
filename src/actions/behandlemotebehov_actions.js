export const BEHANDLE_MOTEBEHOV_FORESPURT = "BEHANDLE_MOTEBEHOV_FORESPURT";
export const BEHANDLE_MOTEBEHOV_BEHANDLER = "BEHANDLE_MOTEBEHOV_BEHANDLER";
export const BEHANDLE_MOTEBEHOV_BEHANDLET = "BEHANDLE_MOTEBEHOV_BEHANDLET";
export const BEHANDLE_MOTEBEHOV_FEILET = "BEHANDLE_MOTEBEHOV_FEILET";
export const BEHANDLE_MOTEBEHOV_FORBUDT = "BEHANDLE_MOTEBEHOV_FORBUDT";

export function behandleMotebehov(fnr, veilederIdent) {
  return {
    type: BEHANDLE_MOTEBEHOV_FORESPURT,
    fnr,
    veilederIdent,
  };
}

export function behandleMotebehovBehandler() {
  return {
    type: BEHANDLE_MOTEBEHOV_BEHANDLER,
  };
}

export function behandleMotebehovBehandlet(veilederIdent) {
  return {
    type: BEHANDLE_MOTEBEHOV_BEHANDLET,
    veilederIdent,
  };
}

export function behandleMotebehovFeilet() {
  return {
    type: BEHANDLE_MOTEBEHOV_FEILET,
  };
}

export function behandleMotebehovForbudt() {
  return {
    type: BEHANDLE_MOTEBEHOV_FORBUDT,
  };
}
