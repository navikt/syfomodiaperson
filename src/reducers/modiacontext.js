import {
  PUSHER_MODIACONTEXT,
  PUSH_MODIACONTEXT_FEILET,
  MODIACONTEXT_PUSHET,
  HENTER_AKTIVBRUKER,
  HENT_AKTIVBRUKER_FEILET,
  HENTER_AKTIVENHET,
  HENT_AKTIVENHET_FEILET,
} from "../actions/actiontyper";

const initiellState = {
  pushet: false,
  pusher: false,
  pushingFeilet: false,
  henterEnhet: false,
  hentingEnhetFeilet: false,
  henterBruker: false,
  hentingBrukerFeilet: false,
  data: {},
};

export default function modiacontext(state = initiellState, action = {}) {
  switch (action.type) {
    case PUSH_MODIACONTEXT_FEILET: {
      return Object.assign({}, state, {
        pushet: false,
        pusher: false,
        pushingFeilet: true,
      });
    }
    case PUSHER_MODIACONTEXT: {
      return Object.assign({}, state, {
        pushet: false,
        pusher: true,
        pushingFeilet: false,
      });
    }
    case MODIACONTEXT_PUSHET: {
      return Object.assign({}, state, {
        pushet: true,
        pusher: false,
        pushingFeilet: false,
      });
    }
    case HENT_AKTIVBRUKER_FEILET: {
      return Object.assign({}, state, {
        henterBruker: false,
        hentingBrukerFeilet: true,
      });
    }
    case HENTER_AKTIVBRUKER: {
      return Object.assign({}, state, {
        henterBruker: true,
        hentingBrukerFeilet: false,
      });
    }
    case HENT_AKTIVENHET_FEILET: {
      return Object.assign({}, state, {
        henterEnhet: false,
        hentingEnhetFeilet: true,
      });
    }
    case HENTER_AKTIVENHET: {
      return Object.assign({}, state, {
        henterEnhet: true,
        hentingEnhetFeilet: false,
      });
    }
    default: {
      return state;
    }
  }
}
