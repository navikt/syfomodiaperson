export const HENT_MOTEBEHOV_FORESPURT = "HENT_MOTEBEHOV_FORESPURT";
export const HENT_MOTEBEHOV_HENTER = "HENT_MOTEBEHOV_HENTER";
export const HENT_MOTEBEHOV_HENTET = "HENT_MOTEBEHOV_HENTETq";
export const HENT_MOTEBEHOV_FEILET = "HENT_MOTEBEHOV_FEILET";
export const HENT_MOTEBEHOV_IKKE_TILGANG = "HENT_MOTEBEHOV_IKKE_TILGANG";

export function hentMotebehov(fnr) {
  return {
    type: HENT_MOTEBEHOV_FORESPURT,
    fnr,
  };
}

export function henterMotebehov() {
  return {
    type: HENT_MOTEBEHOV_HENTER,
  };
}

export function motebehovHentet(data) {
  return {
    type: HENT_MOTEBEHOV_HENTET,
    data,
  };
}

export function hentMotebehovFeilet() {
  return {
    type: HENT_MOTEBEHOV_FEILET,
  };
}

export function hentMotebehovIkkeTilgang(tilgang) {
  return {
    type: HENT_MOTEBEHOV_IKKE_TILGANG,
    tilgang,
  };
}
