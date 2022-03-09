import { HistorikkEvent } from "./types/historikkTypes";

export enum HistorikkMoterActionTypes {
  HENT_HISTORIKK_FEILET_MOTER = `HENT_HISTORIKK_FEILET_MOTER`,
  HENTER_HISTORIKK_MOTER = `HENTER_HISTORIKK_MOTER`,
  HENT_HISTORIKK_MOTER = `HENT_HISTORIKK_MOTER`,
  HISTORIKK_HENTET_MOTER = `HISTORIKK_HENTET_MOTER`,
}

export interface HentHistorikkMoterFeiletAction {
  type: HistorikkMoterActionTypes.HENT_HISTORIKK_FEILET_MOTER;
}

export interface HenterHistorikkMoterAction {
  type: HistorikkMoterActionTypes.HENTER_HISTORIKK_MOTER;
}

export interface HentHistorikkMoterAction {
  type: HistorikkMoterActionTypes.HENT_HISTORIKK_MOTER;
  fnr: string;
}

export interface HistorikkMoterHentetAction {
  type: HistorikkMoterActionTypes.HISTORIKK_HENTET_MOTER;
  data: HistorikkEvent[];
}

export type HistorikkMoterActions =
  | HentHistorikkMoterAction
  | HenterHistorikkMoterAction
  | HentHistorikkMoterFeiletAction
  | HistorikkMoterHentetAction;

export const hentHistorikkMoterFeilet = (): HentHistorikkMoterFeiletAction => {
  return { type: HistorikkMoterActionTypes.HENT_HISTORIKK_FEILET_MOTER };
};

export const henterHistorikkMoter = (): HenterHistorikkMoterAction => {
  return { type: HistorikkMoterActionTypes.HENTER_HISTORIKK_MOTER };
};

export const hentHistorikkMoter = (fnr: string): HentHistorikkMoterAction => {
  return { type: HistorikkMoterActionTypes.HENT_HISTORIKK_MOTER, fnr };
};

export const historikkMoterHentet = (
  data: HistorikkEvent[]
): HistorikkMoterHentetAction => {
  return { type: HistorikkMoterActionTypes.HISTORIKK_HENTET_MOTER, data };
};
