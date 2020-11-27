export const HENT_OPPFOELGINGSDIALOGER_FEILET =
  "HENT_OPPFOELGINGSDIALOGER_FEILET";
export const HENTER_OPPFOELGINGSDIALOGER = "HENTER_OPPFOELGINGSDIALOGER";
export const OPPFOELGINGSDIALOGER_HENTET = "OPPFOELGINGSDIALOGER_HENTET";
export const HENT_OPPFOELGINGSDIALOGER_FORESPURT =
  "HENT_OPPFOELGINGSDIALOGER_FORESPURT";

export function hentOppfoelgingsdialogerFeilet() {
  return {
    type: HENT_OPPFOELGINGSDIALOGER_FEILET,
  };
}

export function henterOppfoelgingsdialoger() {
  return {
    type: HENTER_OPPFOELGINGSDIALOGER,
  };
}

export function hentOppfolgingsdialogerHentet(data) {
  return {
    type: OPPFOELGINGSDIALOGER_HENTET,
    data,
  };
}

export function hentOppfoelgingsdialoger(fnr) {
  return {
    type: HENT_OPPFOELGINGSDIALOGER_FORESPURT,
    fnr,
  };
}
