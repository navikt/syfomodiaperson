import {
  HENT_BEKREFT_MOTE_ARBEIDSGIVEREPOSTINNHOLD_FORESPURT,
  HENTER_ARBEIDSGIVEREPOSTINNHOLD,
  ARBEIDSGIVEREPOSTINNHOLD_HENTET,
  HENT_ARBEIDSGIVEREPOSTINNHOLD_FEILET,
} from "./actiontyper";

export const hentBekreftMoteArbeidsgiverEpostinnhold = (
  motedeltakerUuid,
  valgtAlternativId
) => {
  return {
    type: HENT_BEKREFT_MOTE_ARBEIDSGIVEREPOSTINNHOLD_FORESPURT,
    motedeltakerUuid,
    valgtAlternativId,
  };
};

export const henterArbeidstakerEpostInnhold = () => {
  return {
    type: HENTER_ARBEIDSGIVEREPOSTINNHOLD,
  };
};

export const arbeidsgiverEpostInnholdHentet = (eposttype, data) => {
  return {
    type: ARBEIDSGIVEREPOSTINNHOLD_HENTET,
    eposttype,
    data,
  };
};

export const hentArbeidsgiverEpostinnholdFeilet = () => {
  return {
    type: HENT_ARBEIDSGIVEREPOSTINNHOLD_FEILET,
  };
};
