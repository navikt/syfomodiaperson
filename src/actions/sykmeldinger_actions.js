export const HENT_SYKMELDINGER_FEILET = "HENT_SYKMELDINGER_FEILET";
export const HENTER_SYKMELDINGER = "HENTER_SYKMELDINGER";
export const SYKMELDINGER_SORTERT = "SYKMELDINGER_SORTERT";
export const HENT_SYKMELDINGER_FORESPURT = "HENT_SYKMELDINGER_FORESPURT";
export const SYKMELDINGER_HENTET = "SYKMELDINGER_HENTET";

export function hentSykmeldingerFeilet() {
  return {
    type: HENT_SYKMELDINGER_FEILET,
  };
}

export function henterSykmeldinger() {
  return {
    type: HENTER_SYKMELDINGER,
  };
}

export function sorterSykmeldinger(kriterium, status) {
  return {
    type: SYKMELDINGER_SORTERT,
    kriterium,
    status,
  };
}

export function hentSykmeldinger(fnr) {
  return {
    type: HENT_SYKMELDINGER_FORESPURT,
    fnr,
  };
}

export function sykmeldingerHentet(data, fnr) {
  return {
    type: SYKMELDINGER_HENTET,
    data,
    fnr,
  };
}
