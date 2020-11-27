import { Reducer } from "redux";
import {
  HENT_PERSONOPPGAVER_HENTER,
  HENT_PERSONOPPGAVER_HENTET,
  HENT_PERSONOPPGAVER_FEILET,
  BEHANDLE_PERSONOPPGAVE_BEHANDLET,
} from "../actions/personoppgave_actions";
import { PersonOppgave } from "../types/PersonOppgave";

export interface PersonOppgaverState {
  henter: boolean;
  hentet: boolean;
  hentingFeilet: boolean;
  hentingForsokt: boolean;
  data: PersonOppgave[];
}

export const initialState: PersonOppgaverState = {
  henter: false,
  hentet: false,
  hentingFeilet: false,
  hentingForsokt: false,
  data: [],
};

export const PersonOppgaveType = {
  OPPFOLGINGSPLANLPS: "OPPFOLGINGSPLANLPS",
};

const oppfolgingsplanerlps: Reducer<PersonOppgaverState> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case HENT_PERSONOPPGAVER_HENTER: {
      return {
        ...state,
        henter: true,
        hentet: false,
        hentingFeilet: false,
        hentingForsokt: false,
      };
    }
    case HENT_PERSONOPPGAVER_HENTET: {
      return {
        ...state,
        henter: false,
        hentet: true,
        hentingForsokt: true,
        data: action.data,
      };
    }
    case HENT_PERSONOPPGAVER_FEILET: {
      return {
        ...state,
        henter: false,
        hentingFeilet: true,
        hentingForsokt: true,
      };
    }
    case BEHANDLE_PERSONOPPGAVE_BEHANDLET: {
      const data = [...state.data].map((personOppgave) => {
        if (personOppgave.uuid === action.uuid) {
          return {
            ...personOppgave,
            behandletTidspunkt: new Date(),
            behandletVeilederIdent: action.veilederIdent,
          };
        }
        return personOppgave;
      });
      return {
        ...state,
        data,
      };
    }
    default:
      return state;
  }
};

export default oppfolgingsplanerlps;
