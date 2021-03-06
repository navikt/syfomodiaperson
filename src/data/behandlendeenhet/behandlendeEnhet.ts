import { Reducer } from "redux";
import {
  HENT_BEHANDLENDE_ENHET_FEILET,
  HENTER_BEHANDLENDE_ENHET,
  BEHANDLENDE_ENHET_HENTET,
} from "./behandlendeEnhet_actions";
import { BehandlendeEnhet } from "./types/BehandlendeEnhet";

export interface BehandlendeEnhetState {
  henter: boolean;
  hentingFeilet: boolean;
  data: BehandlendeEnhet;
}

export const initialState: BehandlendeEnhetState = {
  henter: false,
  hentingFeilet: false,
  data: { navn: "", enhetId: "" },
};

const behandlendeEnhet: Reducer<BehandlendeEnhetState> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case HENT_BEHANDLENDE_ENHET_FEILET: {
      return {
        ...state,
        henter: false,
        hentingFeilet: true,
      };
    }
    case HENTER_BEHANDLENDE_ENHET: {
      return {
        ...state,
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
};

export default behandlendeEnhet;
