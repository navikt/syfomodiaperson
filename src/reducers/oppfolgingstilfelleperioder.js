import {
  HENT_OPPFOLGINGSTILFELLEPERIODER_FEILET,
  HENT_OPPFOLGINGSTILFELLEPERIODER_HENTER,
  HENT_OPPFOLGINGSTILFELLEPERIODER_HENTET,
} from "../actions/oppfolgingstilfelleperioder_actions";

const initiellState = {};

export default function oppfolgingstilfelleperioder(
  state = initiellState,
  action = {}
) {
  const arbeidsgiver = {};
  switch (action.type) {
    case HENT_OPPFOLGINGSTILFELLEPERIODER_FEILET:
      arbeidsgiver[action.orgnummer] = {
        henter: false,
        hentet: false,
        hentingFeilet: true,
        hentingForsokt: true,
        data: state[action.orgnummer] ? state[action.orgnummer].data : [],
      };
      return { ...state, ...arbeidsgiver };
    case HENT_OPPFOLGINGSTILFELLEPERIODER_HENTER:
      arbeidsgiver[action.orgnummer] = {
        henter: true,
        hentet: false,
        hentingFeilet: false,
        hentingForsokt: false,
        data: state[action.orgnummer] ? state[action.orgnummer].data : [],
      };
      return { ...state, ...arbeidsgiver };
    case HENT_OPPFOLGINGSTILFELLEPERIODER_HENTET:
      arbeidsgiver[action.orgnummer] = {
        henter: false,
        hentet: true,
        hentingFeilet: false,
        hentingForsokt: true,
        data: action.data,
      };
      return { ...state, ...arbeidsgiver };
    default: {
      return state;
    }
  }
}
