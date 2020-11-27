import {
  HENTER_EGENANSATT,
  EGENANSATT_HENTET,
  HENT_EGENANSATT_FEILET,
} from "../actions/egenansatt_actions";

const initiellState = {
  henter: false,
  hentet: false,
  hentingFeilet: false,
  data: {},
};

export default function egenansatt(state = initiellState, action) {
  switch (action.type) {
    case HENTER_EGENANSATT: {
      return Object.assign({}, state, {
        henter: true,
        hentet: false,
        hentingFeilet: false,
        data: {},
      });
    }
    case EGENANSATT_HENTET: {
      return Object.assign({}, state, {
        henter: false,
        hentet: true,
        data: {
          erEgenAnsatt: action.data,
        },
      });
    }
    case HENT_EGENANSATT_FEILET: {
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
