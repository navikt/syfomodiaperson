export const SOKNADER_HENTET = "SOKNADER_HENTET";
export const HENTER_SOKNADER = "HENTER_SOKNADER";
export const HENT_SOKNADER_FEILET = "HENT_SOKNADER_FEILET";
export const HENT_SOKNADER_FORESPURT = "HENT_SOKNADER_FORESPURT";

export const soknaderHentet = (soknader) => {
  return {
    type: SOKNADER_HENTET,
    soknader,
  };
};

export const henterSoknader = () => {
  return {
    type: HENTER_SOKNADER,
  };
};

export const hentSoknaderFeilet = () => {
  return {
    type: HENT_SOKNADER_FEILET,
  };
};

export const hentSoknader = (fnr) => {
  return {
    type: HENT_SOKNADER_FORESPURT,
    fnr,
  };
};
