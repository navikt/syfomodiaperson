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
  | "OPPFOLGINGSPLAN_LPS";

export interface HistorikkEvent {
  opprettetAv?: string;
  tekst: string;
  tidspunkt: Date;
  kilde: HistorikkEventType;
  expandableContent?: string;
}
