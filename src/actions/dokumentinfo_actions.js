export const HENT_DOKUMENTINFO_FORESPURT = "HENT_DOKUMENTINFO_FORESPURT";
export const HENTER_DOKUMENTINFO = "HENTER_DOKUMENTINFO";
export const HENT_DOKUMENTINFO_FEILET = "HENT_DOKUMENTINFO_FEILET";
export const DOKUMENTINFO_HENTET = "DOKUMENTINFO_HENTET";

export function hentDokumentinfoFeilet(planId) {
  return {
    type: HENT_DOKUMENTINFO_FEILET,
    planId,
  };
}

export function henterDokumentinfo(planId) {
  return {
    type: HENTER_DOKUMENTINFO,
    planId,
  };
}

export function dokumentinfoHentet(planId, data) {
  return {
    type: DOKUMENTINFO_HENTET,
    planId,
    data,
  };
}

export function hentDokumentinfo(id) {
  return {
    type: HENT_DOKUMENTINFO_FORESPURT,
    id,
  };
}
