import {
  HENTER_ARBEIDSGIVEREPOSTINNHOLD,
  ARBEIDSGIVEREPOSTINNHOLD_HENTET,
  HENT_ARBEIDSGIVEREPOSTINNHOLD_FEILET,
} from "../actions/actiontyper";

const defaultState = {
  data: {},
  henter: false,
  hentingFeilet: false,
};

export default function arbeidsgiverEpostinnhold(
  state = defaultState,
  action = {}
) {
  switch (action.type) {
    case HENTER_ARBEIDSGIVEREPOSTINNHOLD: {
      return Object.assign({}, state, {
        henter: true,
        hentingFeilet: false,
      });
    }
    case ARBEIDSGIVEREPOSTINNHOLD_HENTET: {
      return Object.assign({}, state, {
        data: action.data,
        henter: false,
        hentingFeilet: false,
        eposttype: action.eposttype,
      });
    }
    case HENT_ARBEIDSGIVEREPOSTINNHOLD_FEILET: {
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
