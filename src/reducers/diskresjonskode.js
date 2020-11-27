import {
  HENTER_DISKRESJONSKODE,
  DISKRESJONSKODE_HENTET,
  HENT_DISKRESJONSKODE_FEILET,
} from "../actions/diskresjonskode_actions";

const initiellState = {
  henter: false,
  hentet: false,
  hentingFeilet: false,
  data: {},
};

export default function diskresjonskode(state = initiellState, action) {
  switch (action.type) {
    case HENTER_DISKRESJONSKODE: {
      return Object.assign({}, state, {
        henter: true,
        hentet: false,
        hentingFeilet: false,
        data: {},
      });
    }
    case DISKRESJONSKODE_HENTET: {
      return Object.assign({}, state, {
        henter: false,
        hentet: true,
        data: {
          diskresjonskode: action.data.toString(),
        },
      });
    }
    case HENT_DISKRESJONSKODE_FEILET: {
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
