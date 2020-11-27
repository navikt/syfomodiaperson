import * as actions from "../actions/behandlemotebehov_actions";

const defaultState = {
  behandler: false,
  behandlet: false,
  behandleFeilet: false,
  behandleForbudt: false,
};

export default function motebehovBehandling(state = defaultState, action) {
  switch (action.type) {
    case actions.BEHANDLE_MOTEBEHOV_BEHANDLER: {
      return {
        ...state,
        behandler: true,
        behandlet: false,
        behandleFeilet: false,
        behandleForbudt: false,
      };
    }
    case actions.BEHANDLE_MOTEBEHOV_BEHANDLET: {
      return {
        ...state,
        behandler: false,
        behandlet: true,
      };
    }
    case actions.BEHANDLE_MOTEBEHOV_FEILET: {
      return {
        ...state,
        behandler: false,
        behandleFeilet: true,
      };
    }
    case actions.BEHANDLE_MOTEBEHOV_FORBUDT: {
      return {
        ...state,
        behandler: false,
        behandleForbudt: true,
      };
    }
    default: {
      return state;
    }
  }
}
