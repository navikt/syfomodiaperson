import { Reducer } from "redux";
import {
  HENT_MOTEBEHOV_HENTER,
  HENT_MOTEBEHOV_HENTET,
  HENT_MOTEBEHOV_FEILET,
  HENT_MOTEBEHOV_IKKE_TILGANG,
  MotebehovActions,
} from "./motebehov_actions";
import {
  BEHANDLE_MOTEBEHOV_BEHANDLET,
  BehandleMotebehovBehandletAction,
} from "./behandlemotebehov_actions";
import { MotebehovVeilederDTO } from "./types/motebehovTypes";
import { Tilgang } from "@/data/tilgang/tilgangTypes";

export const sorterEtterDato = (
  a: MotebehovVeilederDTO,
  b: MotebehovVeilederDTO
): number => {
  return b.opprettetDato === a.opprettetDato
    ? 0
    : b.opprettetDato > a.opprettetDato
    ? 1
    : -1;
};

export interface MotebehovState {
  henter: boolean;
  hentet: boolean;
  hentingFeilet: boolean;
  hentingForsokt: boolean;
  data: MotebehovVeilederDTO[];
  tilgang?: Tilgang;
}

export const initialState: MotebehovState = {
  data: [],
  henter: false,
  hentet: false,
  hentingFeilet: false,
  hentingForsokt: false,
};

type MoteBehovAction = MotebehovActions | BehandleMotebehovBehandletAction;

const motebehov: Reducer<MotebehovState, MoteBehovAction> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case HENT_MOTEBEHOV_HENTER: {
      return Object.assign({}, state, {
        data: [],
        henter: true,
        hentet: false,
        hentingFeilet: false,
        hentingForsokt: false,
      });
    }
    case HENT_MOTEBEHOV_HENTET: {
      return Object.assign({}, state, {
        data: action.data.sort(sorterEtterDato),
        henter: false,
        hentet: true,
        hentingFeilet: false,
        hentingForsokt: true,
      });
    }
    case HENT_MOTEBEHOV_FEILET: {
      return Object.assign({}, state, {
        data: [],
        henter: false,
        hentet: false,
        hentingFeilet: true,
        hentingForsokt: true,
      });
    }
    case HENT_MOTEBEHOV_IKKE_TILGANG: {
      return Object.assign({}, state, {
        data: [],
        henter: false,
        hentet: false,
        hentingFeilet: false,
        hentingForsokt: true,
        tilgang: action.tilgang,
      });
    }
    case BEHANDLE_MOTEBEHOV_BEHANDLET: {
      const data = [...state.data].map((mb) => {
        return {
          ...mb,
          behandletTidspunkt: new Date(),
          behandletVeilederIdent: action.veilederIdent,
        };
      });
      return {
        ...state,
        data,
      };
    }
    default: {
      return state;
    }
  }
};

export default motebehov;
