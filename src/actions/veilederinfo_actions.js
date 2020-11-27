export const HENT_VEILEDERINFO_FORESPURT = "HENT_VEILEDERINFO_FORESPURT";
export const HENTER_VEILEDERINFO = "HENTER_VEILEDERINFO";
export const HENT_VEILEDERINFO_FEILET = "HENT_VEILEDERINFO_FEILET";
export const VEILEDERINFO_HENTET = "VEILEDERINFO_HENTET";

export function hentVeilederinfo() {
  return {
    type: HENT_VEILEDERINFO_FORESPURT,
  };
}

export function henterVeilederinfo() {
  return {
    type: HENTER_VEILEDERINFO,
  };
}

export function veilederinfoHentet(data) {
  return {
    type: VEILEDERINFO_HENTET,
    data,
  };
}

export function hentVeilederinfoFeilet() {
  return {
    type: HENT_VEILEDERINFO_FEILET,
  };
}
