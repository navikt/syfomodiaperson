import {
  HENTER_VIRKSOMHET,
  VIRKSOMHET_HENTET,
  HENT_VIRKSOMHET_FEILET,
} from "../actions/virksomhet_actions";

const initiellState = {};

export default function virksomhet(state = initiellState, action = {}) {
  const virksomhetTemp = {};
  switch (action.type) {
    case HENTER_VIRKSOMHET: {
      virksomhetTemp[action.orgnummer] = {
        henter: true,
        hentet: false,
        hentingFeilet: false,
        hentingForsokt: false,
        data: state[action.orgnummer] ? state[action.orgnummer].data : {},
      };
      return { ...state, ...virksomhetTemp };
    }
    case VIRKSOMHET_HENTET: {
      const nyeData = {};
      nyeData[action.orgnummer] = action.data.navn;
      virksomhetTemp[action.orgnummer] = {
        henter: false,
        hentet: true,
        hentingFeilet: false,
        hentingForsokt: true,
        data: {
          ...state[action.orgnummer].data,
          ...nyeData,
        },
      };
      return { ...state, ...virksomhetTemp };
    }
    case HENT_VIRKSOMHET_FEILET: {
      virksomhetTemp[action.orgnummer] = {
        henter: false,
        hentet: false,
        hentingFeilet: true,
        hentingForsokt: true,
        data: state[action.orgnummer] ? state[action.orgnummer].data : {},
      };
      return { ...state, ...virksomhetTemp };
    }
    default: {
      return state;
    }
  }
}
