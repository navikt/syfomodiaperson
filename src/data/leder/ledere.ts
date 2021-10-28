import { Reducer } from "redux";
import {
  HENTER_LEDERE,
  LEDERE_HENTET,
  HENT_LEDERE_FEILET,
  LedereActions,
} from "./ledere_actions";
import { currentLedere, formerLedere } from "@/utils/ledereUtils";

export enum NarmesteLederRelasjonStatus {
  INNMELDT_AKTIV = "INNMELDT_AKTIV",
  DEAKTIVERT = "DEAKTIVERT",
  DEAKTIVERT_ARBEIDSTAKER = "DEAKTIVERT_ARBEIDSTAKER",
  DEAKTIVERT_ARBEIDSTAKER_INNSENDT_SYKMELDING = "DEAKTIVERT_ARBEIDSTAKER_INNSENDT_SYKMELDING",
  DEAKTIVERT_LEDER = "DEAKTIVERT_LEDER",
  DEAKTIVERT_ARBEIDSFORHOLD = "DEAKTIVERT_ARBEIDSFORHOLD",
  DEAKTIVERT_NY_LEDER = "DEAKTIVERT_NY_LEDER",
}

export interface NarmesteLederRelasjonDTO {
  uuid: string;
  arbeidstakerPersonIdentNumber: string;
  virksomhetsnummer: string;
  virksomhetsnavn: string;
  narmesteLederPersonIdentNumber: string;
  narmesteLederEpost: string;
  narmesteLederTelefonnummer: string;
  narmesteLederNavn: string;
  aktivFom: Date;
  aktivTom?: Date;
  arbeidsgiverForskutterer?: boolean;
  timestamp: Date;
  status: NarmesteLederRelasjonStatus;
}

export interface LedereState {
  henter: boolean;
  hentet: boolean;
  hentingFeilet: boolean;
  hentingForsokt: boolean;
  currentLedere: NarmesteLederRelasjonDTO[];
  allLedere: NarmesteLederRelasjonDTO[];
  formerLedere: NarmesteLederRelasjonDTO[];
}

export const initialState: LedereState = {
  henter: false,
  hentet: false,
  hentingFeilet: false,
  hentingForsokt: false,
  currentLedere: [],
  allLedere: [],
  formerLedere: [],
};

const ledere: Reducer<LedereState, LedereActions> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case LEDERE_HENTET: {
      return {
        currentLedere: currentLedere(action.data),
        formerLedere: formerLedere(action.data),
        allLedere: action.data,
        henter: false,
        hentet: true,
        hentingFeilet: false,
        hentingForsokt: true,
      };
    }
    case HENTER_LEDERE: {
      return {
        henter: true,
        hentet: false,
        hentingFeilet: false,
        hentingForsokt: false,
        currentLedere: [],
        formerLedere: [],
        allLedere: [],
      };
    }
    case HENT_LEDERE_FEILET: {
      return {
        henter: false,
        hentet: false,
        hentingFeilet: true,
        hentingForsokt: true,
        currentLedere: [],
        formerLedere: [],
        allLedere: [],
      };
    }
    default: {
      return state;
    }
  }
};

export default ledere;
