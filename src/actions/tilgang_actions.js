export const SJEKKER_TILGANG = "SJEKKER_TILGANG";
export const HAR_TILGANG = "HAR_TILGANG";
export const HAR_IKKE_TILGANG = "HAR_IKKE_TILGANG";
export const SJEKK_TILGANG_FEILET = "SJEKK_TILGANG_FEILET";
export const SJEKK_TILGANG_FORESPURT = "SJEKK_TILGANG_FORESPURT";

export function sjekkTilgangFeilet() {
  return {
    type: SJEKK_TILGANG_FEILET,
  };
}

export function sjekkerTilgang() {
  return {
    type: SJEKKER_TILGANG,
  };
}

export function harTilgang() {
  return {
    type: HAR_TILGANG,
  };
}

export function harIkkeTilgang(begrunnelse) {
  return {
    type: HAR_IKKE_TILGANG,
    begrunnelse,
  };
}

export function sjekkTilgang(fnr) {
  return {
    type: SJEKK_TILGANG_FORESPURT,
    fnr,
  };
}
