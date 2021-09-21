import { Reducer } from "redux";
import { UnleashActions, UnleashActionTypes } from "./unleash_actions";
import { ToggleNames, Toggles } from "@/data/unleash/unleash_types";

export interface UnleashState {
  fetching: boolean;
  fetchingFailed: boolean;
  toggles: Toggles;
}

export const initialState: UnleashState = {
  fetching: false,
  fetchingFailed: false,
  toggles: {
    [ToggleNames.dm2]: false,
    [ToggleNames.dm2VarselFysiskBrev]: false,
    [ToggleNames.dm2InnkallingFastlege]: false,
  },
};

const unleash: Reducer<UnleashState, UnleashActions> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case UnleashActionTypes.FETCH_UNLEASH_TOGGLES: {
      return {
        ...state,
        fetching: true,
        fetchingFailed: false,
      };
    }
    case UnleashActionTypes.FETCH_UNLEASH_TOGGLES_FAILED: {
      return {
        ...state,
        fetching: false,
        fetchingFailed: true,
      };
    }
    case UnleashActionTypes.FETCH_UNLEASH_TOGGLES_SUCCESS: {
      return {
        ...state,
        fetching: false,
        fetchingFailed: false,
        toggles: action.toggles,
      };
    }
    default: {
      return state;
    }
  }
};

export default unleash;
