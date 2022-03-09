import { Reducer } from "redux";
import { HistorikkEvent } from "./types/historikkTypes";
import {
  HistorikkMoterActions,
  HistorikkMoterActionTypes,
} from "./historikk_actions";
import { mapHistorikkEvents } from "./historikkQueryHooks";

export interface HistorikkState {
  moteHistorikk: HistorikkEvent[];
  hentingMoterFeilet: boolean;
  henterMoter: boolean;
  hentetMoter: boolean;
}

export const initialState: HistorikkState = {
  moteHistorikk: [],
  hentingMoterFeilet: false,
  henterMoter: false,
  hentetMoter: false,
};

const historikk: Reducer<HistorikkState, HistorikkMoterActions> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case HistorikkMoterActionTypes.HISTORIKK_HENTET_MOTER: {
      return {
        ...state,
        henterMoter: false,
        hentetMoter: true,
        moteHistorikk: mapHistorikkEvents(action.data, "MOTER"),
      };
    }
    case HistorikkMoterActionTypes.HENTER_HISTORIKK_MOTER: {
      return {
        ...state,
        henterMoter: true,
      };
    }
    case HistorikkMoterActionTypes.HENT_HISTORIKK_FEILET_MOTER: {
      return {
        ...state,
        henterMoter: false,
        hentingMoterFeilet: true,
      };
    }
    default: {
      return state;
    }
  }
};

export default historikk;
