const defaultState = {
  valgtEnhet: "",
};

export default function (state = defaultState, action = {}) {
  switch (action.type) {
    case "VALGT_ENHET": {
      return Object.assign({}, defaultState, {
        valgtEnhet: action.data,
      });
    }
    default: {
      return state;
    }
  }
}
