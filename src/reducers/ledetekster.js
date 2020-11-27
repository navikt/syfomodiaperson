import {
  LEDETEKSTER_HENTET,
  HENTER_LEDETEKSTER,
  HENT_LEDETEKSTER_FEILET,
} from "../actions/ledetekster_actions";

const initiellState = {
  henter: false,
  hentingFeilet: false,
  hentet: false,
  data: {},
};

export default function ledetekster(state = initiellState, action = {}) {
  switch (action.type) {
    case LEDETEKSTER_HENTET:
      return {
        data: action.ledetekster,
        henter: false,
        hentingFeilet: false,
        hentet: true,
      };
    case HENTER_LEDETEKSTER:
      return {
        data: {},
        henter: true,
        hentingFeilet: false,
        hentet: false,
      };
    case HENT_LEDETEKSTER_FEILET:
      return {
        data: {},
        henter: false,
        hentingFeilet: true,
        hentet: true,
      };
    default:
      return state;
  }
}
