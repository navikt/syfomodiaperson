import { NarmesteLederRelasjonDTO } from "./ledere";

export const HENT_LEDERE_FORESPURT = "HENT_LEDERE_FORESPURT";
export const HENTER_LEDERE = "HENTER_LEDERE";
export const LEDERE_HENTET = "LEDERE_HENTET";
export const HENT_LEDERE_FEILET = "HENT_LEDERE_FEILET";

export interface HentLedereAction {
  type: typeof HENT_LEDERE_FORESPURT;
  fnr: string;
}

export interface HenterLedereAction {
  type: typeof HENTER_LEDERE;
}

export interface LedereHentetAction {
  type: typeof LEDERE_HENTET;
  data: NarmesteLederRelasjonDTO[];
}

export interface HentLedereFeiletAction {
  type: typeof HENT_LEDERE_FEILET;
}

export type LedereActions =
  | HentLedereAction
  | HenterLedereAction
  | LedereHentetAction
  | HentLedereFeiletAction;

export const hentLedere = (fnr: string): HentLedereAction => ({
  type: HENT_LEDERE_FORESPURT,
  fnr,
});

export const henterLedere = (): HenterLedereAction => ({
  type: HENTER_LEDERE,
});

export const hentLedereFailed = (): HentLedereFeiletAction => ({
  type: HENT_LEDERE_FEILET,
});

export const ledereHentet = (
  data: NarmesteLederRelasjonDTO[]
): LedereHentetAction => ({
  type: LEDERE_HENTET,
  data,
});
