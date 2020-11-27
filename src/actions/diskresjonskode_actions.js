export const HENT_DISKRESJONSKODE_FORESPURT = "HENT_DISKRESJONSKODE_FORESPURT";
export const HENTER_DISKRESJONSKODE = "HENTER_DISKRESJONSKODE";
export const HENT_DISKRESJONSKODE_FEILET = "HENT_DISKRESJONSKODE_FEILET";
export const DISKRESJONSKODE_HENTET = "DISKRESJONSKODE_HENTET";

export function hentDiskresjonskode(fnr) {
  return {
    type: HENT_DISKRESJONSKODE_FORESPURT,
    fnr,
  };
}

export function hentDiskresjonskodeFeilet() {
  return {
    type: HENT_DISKRESJONSKODE_FEILET,
  };
}

export function henterDiskresjonskode() {
  return {
    type: HENTER_DISKRESJONSKODE,
  };
}

export function diskresjonskodeHentet(data) {
  return {
    type: DISKRESJONSKODE_HENTET,
    data,
  };
}
