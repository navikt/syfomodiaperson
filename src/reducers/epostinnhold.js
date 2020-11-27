import {
  HENTER_EPOSTINNHOLD,
  EPOSTINNHOLD_HENTET,
  HENT_EPOSTINNHOLD_FEILET,
} from "../actions/epostinnhold_actions";

const defaultState = {
  data: {},
  henter: false,
  hentingFeilet: false,
};

export default function epostinnhold(state = defaultState, action = {}) {
  switch (action.type) {
    case HENTER_EPOSTINNHOLD: {
      return Object.assign({}, state, {
        henter: true,
        hentingFeilet: false,
      });
    }
    case EPOSTINNHOLD_HENTET: {
      return Object.assign({}, state, {
        data: action.data,
        henter: false,
        hentingFeilet: false,
        eposttype: action.eposttype,
      });
    }
    case HENT_EPOSTINNHOLD_FEILET: {
      return Object.assign({}, state, {
        data: {},
        henter: false,
        hentingFeilet: true,
      });
    }
    default: {
      return state;
    }
  }
}
