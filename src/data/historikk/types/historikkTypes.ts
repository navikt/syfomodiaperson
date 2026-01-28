export type HistorikkEventType =
  | "MOTER"
  | "MOTEBEHOV"
  | "OPPFOLGINGSPLAN"
  | "LEDER"
  | "AKTIVITETSKRAV"
  | "ARBEIDSUFORHET"
  | "MANGLENDE_MEDVIRKNING"
  | "FRISKMELDING_TIL_ARBEIDSFORMIDLING"
  | "VEILEDER_TILDELING"
  | "DIALOG_MED_BEHANDLER"
  | "SEN_OPPFOLGING"
  | "DIALOGMOTEKANDIDAT"
  | "OPPFOLGINGSOPPGAVE"
  | "TILDELT_OPPFOLGINGSENHET"
  | "OPPFOLGINGSPLAN_LPS"
  | "OPPFOLGINGSPLAN_FORESPORSEL"
  | "KARTLEGGINGSPORSMAAL";

export interface HistorikkEvent {
  opprettetAv?: string;
  tekst: string;
  tidspunkt: Date;
  kilde: HistorikkEventType;
  expandableContent?: string;
}
