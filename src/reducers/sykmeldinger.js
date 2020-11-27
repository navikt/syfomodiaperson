import {
  newSMFormat2OldFormat,
  oldFormatSMForAG,
} from "../utils/sykmeldinger/sykmeldingParser";
import {
  HENT_SYKMELDINGER_FEILET,
  HENTER_SYKMELDINGER,
  SYKMELDINGER_HENTET,
  SYKMELDINGER_SORTERT,
} from "../actions/sykmeldinger_actions";

const initiellState = {
  henter: false,
  hentingFeilet: false,
  hentet: false,
  data: [],
  arbeidsgiverssykmeldinger: [],
};

export default function sykmeldinger(state = initiellState, action = {}) {
  switch (action.type) {
    case HENT_SYKMELDINGER_FEILET: {
      return Object.assign({}, state, {
        data: [],
        arbeidsgiverssykmeldinger: [],
        henter: false,
        hentet: true,
        hentingFeilet: true,
      });
    }
    case HENTER_SYKMELDINGER: {
      return {
        data: [],
        arbeidsgiverssykmeldinger: [],
        henter: true,
        hentet: false,
        hentingFeilet: false,
      };
    }
    case SYKMELDINGER_HENTET: {
      return {
        henter: false,
        hentingFeilet: false,
        hentet: true,
        data: action.data.map((sykmelding) => {
          return newSMFormat2OldFormat(sykmelding, action.fnr);
        }),
        arbeidsgiverssykmeldinger: action.data.map((sykmelding) => {
          return oldFormatSMForAG(sykmelding, action.fnr);
        }),
      };
    }
    case SYKMELDINGER_SORTERT: {
      let sortering = {};
      sortering[action.status] = action.kriterium;
      sortering = {
        ...state.sortering,
        ...sortering,
      };
      return {
        ...state,
        sortering,
      };
    }
    default: {
      return state;
    }
  }
}
