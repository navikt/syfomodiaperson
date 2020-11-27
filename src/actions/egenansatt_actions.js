export const HENT_EGENANSATT_FORESPURT = "HENT_EGENANSATT_FORESPURT";
export const HENTER_EGENANSATT = "HENTER_EGENANSATT";
export const HENT_EGENANSATT_FEILET = "HENT_EGENANSATT_FEILET";
export const EGENANSATT_HENTET = "EGENANSATT_HENTET";

export function hentEgenansatt(fnr) {
  return {
    type: HENT_EGENANSATT_FORESPURT,
    fnr,
  };
}

export function hentEgenansattFeilet() {
  return {
    type: HENT_EGENANSATT_FEILET,
  };
}

export function henterEgenansatt() {
  return {
    type: HENTER_EGENANSATT,
  };
}

export function egenansattHentet(data) {
  return {
    type: EGENANSATT_HENTET,
    data,
  };
}
