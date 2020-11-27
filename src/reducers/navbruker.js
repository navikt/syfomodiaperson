const defaultState = {
  data: {},
};

const navbruker = (state = defaultState, action = {}) => {
  switch (action.type) {
    case "NAVBRUKER_HENTET": {
      return Object.assign({
        henter: false,
        hentingFeilet: false,
        data: Object.assign({}, state.data, action.data),
      });
    }
    case "HENT_NAVBRUKER_FORESPURT": {
      return Object.assign({
        henter: true,
        hentingFeilet: false,
        data: Object.assign({}, state.data, {
          kontaktinfo: {
            fnr: action.fnr,
          },
        }),
      });
    }
    case "HENT_NAVBRUKER_FEILET": {
      return Object.assign({
        henter: false,
        hentingFeilet: true,
        data: Object.assign({}, state.data, action.data),
      });
    }
    default: {
      return state;
    }
  }
};

export default navbruker;
