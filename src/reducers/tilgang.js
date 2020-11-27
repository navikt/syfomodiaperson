import {
  SJEKKER_TILGANG,
  HAR_TILGANG,
  HAR_IKKE_TILGANG,
  SJEKK_TILGANG_FEILET,
} from "../actions/tilgang_actions";

const initiellState = {
  hentet: false,
  henter: false,
  hentingFeilet: false,
  data: {
    harTilgang: false,
  },
};

export default function tilgang(state = initiellState, action = {}) {
  switch (action.type) {
    case SJEKKER_TILGANG: {
      return Object.assign({}, state, {
        henter: true,
        hentingFeilet: false,
      });
    }
    case HAR_TILGANG: {
      return Object.assign({}, state, {
        data: Object.assign({}, state.data, {
          harTilgang: true,
        }),
        henter: false,
        hentingFeilet: false,
        hentet: true,
      });
    }
    case HAR_IKKE_TILGANG: {
      return Object.assign({}, state, {
        data: Object.assign({}, state.data, {
          harTilgang: false,
          begrunnelse: action.begrunnelse,
        }),
        henter: false,
        hentingFeilet: false,
        hentet: true,
      });
    }
    case SJEKK_TILGANG_FEILET: {
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
