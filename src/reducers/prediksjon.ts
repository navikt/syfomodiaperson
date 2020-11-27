import {
  HENT_PREDIKSJON_FEILET,
  HENT_PREDIKSJON_HENTER,
  HENT_PREDIKSJON_HENTET,
} from "../actions/prediksjon_actions";

export interface Prediksjon {
  kortereVarighetGrunner: string[];
  langt: boolean;
  lengreVarighetGrunner: string[];
  prediksjonsDato: string;
  treffsikkerhetProsent: number;
}

export interface PrediksjonState {
  henter: boolean;
  hentingFeilet: boolean;
  hentet: boolean;

  data: Prediksjon | null;
}

export const initialState: PrediksjonState = {
  henter: false,
  hentingFeilet: false,
  hentet: false,

  data: null,
};

const prediksjon = (state = initialState, action = { type: "", data: {} }) => {
  switch (action.type) {
    case HENT_PREDIKSJON_HENTER: {
      return {
        ...state,
        henter: true,
        hentingFeilet: false,
        hentet: false,
      };
    }
    case HENT_PREDIKSJON_HENTET: {
      return {
        ...state,
        henter: false,
        hentingFeilet: false,
        hentet: true,
        data: action.data,
      };
    }
    case HENT_PREDIKSJON_FEILET: {
      return {
        ...state,
        henter: false,
        hentingFeilet: true,
        hentet: false,
      };
    }
    default:
      return state;
  }
};

export default prediksjon;
