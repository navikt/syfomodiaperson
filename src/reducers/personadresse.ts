import { Reducer } from "redux";
import {
  HENT_PERSON_ADRESSE_FEILET,
  HENT_PERSON_ADRESSE_HENTER,
  HENT_PERSON_ADRESSE_HENTET,
} from "../actions/personInfo_actions";
import { PersonAdresse } from "../types/PersonAdresse";

export interface PersonAdresseState {
  henter: boolean;
  hentet: boolean;
  hentingFeilet: boolean;
  hentingForsokt: boolean;
  data: PersonAdresse | {};
}

export const initialState: PersonAdresseState = {
  henter: false,
  hentet: false,
  hentingFeilet: false,
  hentingForsokt: false,
  data: {},
};

const personadresse: Reducer<PersonAdresseState> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case HENT_PERSON_ADRESSE_HENTER: {
      return {
        ...state,
        henter: true,
        hentet: false,
        hentingFeilet: false,
        hentingForsokt: false,
      };
    }
    case HENT_PERSON_ADRESSE_HENTET: {
      return {
        ...state,
        henter: false,
        hentet: true,
        hentingForsokt: true,
        data: action.data,
      };
    }
    case HENT_PERSON_ADRESSE_FEILET: {
      return {
        ...state,
        henter: false,
        hentingFeilet: true,
        hentingForsokt: true,
      };
    }
    default:
      return state;
  }
};

export default personadresse;
