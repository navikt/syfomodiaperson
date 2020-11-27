import {
  HENT_BEHANDLENDE_ENHET_FEILET,
  HENTER_BEHANDLENDE_ENHET,
  BEHANDLENDE_ENHET_HENTET,
} from "../actions/behandlendeEnhet_actions";

const initiellState = {
  henter: false,
  hentingFeilet: false,
  data: {},
};

export default function behandlendeEnhet(state = initiellState, action) {
  switch (action.type) {
    case HENT_BEHANDLENDE_ENHET_FEILET: {
      return Object.assign({}, state, {
        data: {},
        henter: false,
        hentingFeilet: true,
      });
    }
    case HENTER_BEHANDLENDE_ENHET: {
      return {
        data: {},
        henter: true,
        hentingFeilet: false,
      };
    }
    case BEHANDLENDE_ENHET_HENTET: {
      return {
        henter: false,
        hentingFeilet: false,
        data: action.data,
      };
    }
    default: {
      return state;
    }
  }
}
