import {
  ENDRE_STATUS_FEILET,
  ENDRER_STATUS,
  HENT_STATUS_FEILET,
  HENTER_STATUS,
  STATUS_ENDRET,
  STATUS_HENTET,
} from "./flaggperson_actions";
import { StatusEndring } from "./types/FlaggPerson";
import { Reducer } from "redux";

export interface FlaggpersonState {
  henter: boolean;
  hentingFeilet: boolean;
  hentet: boolean;

  endrer: boolean;
  endret: boolean;
  endringFeilet: boolean;

  data: StatusEndring[];
}

export const initialState: FlaggpersonState = {
  henter: false,
  hentingFeilet: false,
  hentet: false,

  endrer: false,
  endret: false,
  endringFeilet: false,

  data: [],
};

const flaggperson: Reducer<FlaggpersonState> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case HENTER_STATUS: {
      return {
        ...state,
        henter: true,
        hentingFeilet: false,
        hentet: false,
      };
    }
    case STATUS_HENTET: {
      return {
        ...state,
        henter: false,
        hentingFeilet: false,
        hentet: true,
        data: action.data,
      };
    }
    case HENT_STATUS_FEILET: {
      return {
        ...state,
        henter: false,
        hentingFeilet: true,
        hentet: false,
      };
    }
    case ENDRER_STATUS: {
      return {
        ...state,
        endrer: true,
        endret: false,
        endringFeilet: false,
      };
    }
    case STATUS_ENDRET: {
      return {
        ...state,
        endrer: false,
        endret: true,
        endringFeilet: false,
      };
    }
    case ENDRE_STATUS_FEILET: {
      return {
        ...state,
        endrer: false,
        endret: false,
        endringFeilet: true,
      };
    }
    default:
      return state;
  }
};

export default flaggperson;
