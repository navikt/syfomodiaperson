export const HENT_NAVBRUKER_FORESPURT = "HENT_NAVBRUKER_FORESPURT";
export const HENTER_NAVBRUKER = "HENTER_NAVBRUKER";
export const NAVBRUKER_HENTET = "NAVBRUKER_HENTET";
export const HENT_NAVBRUKER_FEILET = "HENT_NAVBRUKER_FEILET";

export const hentNavbruker = (fnr: string) => {
  return {
    type: HENT_NAVBRUKER_FORESPURT,
    fnr,
  };
};
