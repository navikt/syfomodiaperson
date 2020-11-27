export const HENTER_LEDETEKSTER = "HENTER_LEDETEKSTER";
export const LEDETEKSTER_HENTET = "LEDETEKSTER_HENTET";
export const HENT_LEDETEKSTER_FEILET = "HENT_LEDETEKSTER_FEILET";
export const HENT_LEDETEKSTER_FORESPURT = "HENT_LEDETEKSTER_FORESPURT";

export function henterLedetekster() {
  return {
    type: HENTER_LEDETEKSTER,
  };
}

export function ledeteksterHentet(ledetekster = {}) {
  return {
    type: LEDETEKSTER_HENTET,
    ledetekster,
  };
}

export function hentLedeteksterFeilet() {
  return {
    type: HENT_LEDETEKSTER_FEILET,
  };
}

export function hentLedetekster() {
  return {
    type: HENT_LEDETEKSTER_FORESPURT,
  };
}
