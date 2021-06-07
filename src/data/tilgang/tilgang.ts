import { Reducer } from "redux";
import {
  SJEKKER_TILGANG,
  HAR_TILGANG,
  HAR_IKKE_TILGANG,
  SJEKK_TILGANG_FEILET,
} from "./tilgang_actions";

export interface Tilgang {
  harTilgang: boolean;
  begrunnelse?: string;
}

export interface TilgangState {
  henter: boolean;
  hentet: boolean;
  hentingFeilet: boolean;
  hentingForsokt: boolean;
  data: Tilgang;
}

const initialState: TilgangState = {
  henter: false,
  hentet: false,
  hentingFeilet: false,
  hentingForsokt: false,
  data: {
    harTilgang: false,
  },
};

const tilgang: Reducer<TilgangState> = (
  state = initialState,
  action = { type: "" }
) => {
  switch (action.type) {
    case SJEKKER_TILGANG: {
      return Object.assign({}, state, {
        henter: true,
        hentingFeilet: false,
        hentingForsokt: false,
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
        hentingForsokt: true,
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
        hentingForsokt: true,
      });
    }
    case SJEKK_TILGANG_FEILET: {
      return Object.assign({}, state, {
        henter: false,
        hentingFeilet: true,
        hentingForsokt: true,
      });
    }
    default: {
      return state;
    }
  }
};

export default tilgang;
