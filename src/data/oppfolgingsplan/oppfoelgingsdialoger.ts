import { Reducer } from "redux";
import {
  HENTER_OPPFOELGINGSDIALOGER,
  OPPFOELGINGSDIALOGER_HENTET,
  HENT_OPPFOELGINGSDIALOGER_FEILET,
} from "./oppfoelgingsdialoger_actions";

export interface GodkjentPlanGyldighetTidspunktDTO {
  fom: Date;
  tom: Date;
  evalueres: Date;
}

export interface OPVirksomhetDTO {
  navn: string;
  virksomhetsnummer: string;
}

export interface GodkjentPlanDTO {
  opprettetTidspunkt: Date;
  gyldighetstidspunkt: GodkjentPlanGyldighetTidspunktDTO;
  tvungenGodkjenning: boolean;
  deltMedNAVTidspunkt: Date;
  dokumentUuid: string;
}

export interface OppfolgingsplanDTO {
  id: number;
  uuid: string;
  sistEndretAvAktoerId: string;
  sistEndretDato: Date;
  status: string;
  godkjentPlan: GodkjentPlanDTO;
  virksomhet: OPVirksomhetDTO;
}

export interface OppfolgingsplanerState {
  henter: boolean;
  hentet: boolean;
  hentingFeilet: boolean;
  data: OppfolgingsplanDTO[];
}

const initialState: OppfolgingsplanerState = {
  henter: false,
  hentet: false,
  hentingFeilet: false,
  data: [],
};

const oppfoelgingsdialoger: Reducer<OppfolgingsplanerState> = (
  state = initialState,
  action = { type: "" }
) => {
  switch (action.type) {
    case HENT_OPPFOELGINGSDIALOGER_FEILET: {
      return Object.assign({}, state, {
        data: [],
        hentet: true,
        henter: false,
        hentingFeilet: true,
      });
    }
    case HENTER_OPPFOELGINGSDIALOGER: {
      return Object.assign({}, state, {
        data: [],
        hentet: false,
        henter: true,
        hentingFeilet: false,
      });
    }
    case OPPFOELGINGSDIALOGER_HENTET: {
      return Object.assign({}, state, {
        henter: false,
        hentingFeilet: false,
        hentet: true,
        data: action.data,
      });
    }
    default: {
      return state;
    }
  }
};

export default oppfoelgingsdialoger;
