export const HENT_BEHANDLENDE_ENHET_FORESPURT =
  "HENT_BEHANDLENDE_ENHET_FORESPURT";
export const HENTER_BEHANDLENDE_ENHET = "HENTER_BEHANDLENDE_ENHET";
export const HENT_BEHANDLENDE_ENHET_FEILET = "HENT_BEHANDLENDE_ENHET_FEILET";
export const BEHANDLENDE_ENHET_HENTET = "BEHANDLENDE_ENHET_HENTET";

export function hentBehandlendeEnhet(fnr) {
  return {
    type: HENT_BEHANDLENDE_ENHET_FORESPURT,
    fnr,
  };
}

export function henterBehandlendeEnhet() {
  return {
    type: HENTER_BEHANDLENDE_ENHET,
  };
}

export function behandlendeEnhetHentet(data) {
  return {
    type: BEHANDLENDE_ENHET_HENTET,
    data,
  };
}

export function hentBehandlendeEnhetFeilet() {
  return {
    type: HENT_BEHANDLENDE_ENHET_FEILET,
  };
}
