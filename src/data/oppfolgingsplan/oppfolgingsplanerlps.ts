import { Reducer } from "redux";
import {
  HENT_OPPFOLGINGSPLANER_LPS_FEILET,
  HENT_OPPFOLGINGSPLANER_LPS_HENTER,
  HENT_OPPFOLGINGSPLANER_LPS_HENTET,
} from "./oppfolgingsplanerlps_actions";
import { OppfolgingsplanLPS } from "./types/OppfolgingsplanLPS";
import { PersonOppgave } from "../personoppgave/types/PersonOppgave";
import { BEHANDLE_PERSONOPPGAVE_BEHANDLET } from "../personoppgave/personoppgave_actions";

export interface OppfolgingsplanerlpsState {
  henter: boolean;
  hentet: boolean;
  hentingFeilet: boolean;
  hentingForsokt: boolean;
  data: OppfolgingsplanLPS[];
}

export const initialState: OppfolgingsplanerlpsState = {
  henter: false,
  hentet: false,
  hentingFeilet: false,
  hentingForsokt: false,
  data: [],
};

const oppfolgingsplanerlps: Reducer<OppfolgingsplanerlpsState> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case HENT_OPPFOLGINGSPLANER_LPS_HENTER: {
      return {
        ...state,
        henter: true,
        hentet: false,
        hentingFeilet: false,
        hentingForsokt: false,
      };
    }
    case HENT_OPPFOLGINGSPLANER_LPS_HENTET: {
      const data = [...action.data].map(
        (oppfolgingsplan: OppfolgingsplanLPS) => {
          const personOppgave: PersonOppgave[] = action.personOppgaveList.filter(
            (oppgave: PersonOppgave) => {
              return oppgave.referanseUuid === oppfolgingsplan.uuid;
            }
          );
          if (personOppgave && personOppgave.length > 0) {
            return {
              ...oppfolgingsplan,
              personoppgave: {
                ...personOppgave[0],
              },
            };
          }
          return oppfolgingsplan;
        }
      );
      return {
        ...state,
        henter: false,
        hentet: true,
        hentingForsokt: true,
        data,
      };
    }
    case HENT_OPPFOLGINGSPLANER_LPS_FEILET: {
      return {
        ...state,
        henter: false,
        hentingFeilet: true,
        hentingForsokt: true,
      };
    }
    case BEHANDLE_PERSONOPPGAVE_BEHANDLET: {
      const data = [...state.data].map((oppfolgingsplanLPS) => {
        if (oppfolgingsplanLPS.uuid === action.referanseUuid) {
          return {
            ...oppfolgingsplanLPS,
            personoppgave: {
              ...oppfolgingsplanLPS.personoppgave,
              behandletTidspunkt: new Date(),
              behandletVeilederIdent: action.veilederIdent,
            },
          };
        }
        return oppfolgingsplanLPS;
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
