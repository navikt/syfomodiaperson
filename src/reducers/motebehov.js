import {
  HENT_MOTEBEHOV_HENTER,
  HENT_MOTEBEHOV_HENTET,
  HENT_MOTEBEHOV_FEILET,
  HENT_MOTEBEHOV_IKKE_TILGANG,
} from "../actions/motebehov_actions";
import { BEHANDLE_MOTEBEHOV_BEHANDLET } from "../actions/behandlemotebehov_actions";

export const sorterEtterDato = (a, b) => {
  return b.opprettetDato === a.opprettetDato
    ? 0
    : b.opprettetDato > a.opprettetDato
    ? 1
    : -1;
};

const defaultState = {
  data: [],
  henter: false,
  hentet: false,
  hentingFeilet: false,
  tilgang: {},
};

export default function motebehov(state = defaultState, action) {
  switch (action.type) {
    case HENT_MOTEBEHOV_HENTER: {
      return Object.assign({}, state, {
        data: [],
        henter: true,
        hentet: false,
        hentingFeilet: false,
      });
    }
    case HENT_MOTEBEHOV_HENTET: {
      return Object.assign({}, state, {
        data: action.data.sort(sorterEtterDato),
        henter: false,
        hentet: true,
        hentingFeilet: false,
      });
    }
    case HENT_MOTEBEHOV_FEILET: {
      return Object.assign({}, state, {
        data: [],
        henter: false,
        hentet: false,
        hentingFeilet: true,
      });
    }
    case HENT_MOTEBEHOV_IKKE_TILGANG: {
      return Object.assign({}, state, {
        data: [],
        henter: false,
        hentet: false,
        hentingFeilet: false,
        tilgang: action.tilgang,
      });
    }
    case BEHANDLE_MOTEBEHOV_BEHANDLET: {
      const data = [...state.data].map((mb) => {
        return {
          ...mb,
          behandletTidspunkt: new Date(),
          behandletVeilederIdent: action.veilederIdent,
        };
      });
      return {
        ...state,
        data,
      };
    }
    default: {
      return state;
    }
  }
}
