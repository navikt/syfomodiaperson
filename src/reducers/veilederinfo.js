import {
  HENTER_VEILEDERINFO,
  VEILEDERINFO_HENTET,
  HENT_VEILEDERINFO_FEILET,
} from "../actions/veilederinfo_actions";

const initiellState = {
  hentet: false,
  henter: false,
  hentingFeilet: false,
  data: {},
};

export default function veilederinfo(state = initiellState, action = {}) {
  switch (action.type) {
    case HENTER_VEILEDERINFO: {
      return Object.assign({}, state, {
        henter: true,
        hentet: false,
        hentingFeilet: false,
      });
    }
    case VEILEDERINFO_HENTET: {
      return Object.assign({}, state, {
        henter: false,
        hentet: true,
        data: action.data,
      });
    }
    case HENT_VEILEDERINFO_FEILET: {
      return Object.assign({}, state, {
        henter: false,
        hentingFeilet: true,
      });
    }
    default: {
      return state;
    }
  }
}
