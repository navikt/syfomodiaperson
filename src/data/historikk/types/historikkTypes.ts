export type HistorikkKilde = "MOTER" | "MOTEBEHOV" | "OPPFOLGINGSPLAN";
export type HistorikkEventType =
  | HistorikkKilde
  | "LEDER"
  | "AKTIVITETSKRAV"
  | "ARBEIDSUFORHET"
  | "MANGLENDE_MEDVIRKNING"
  | "FRISKMELDING_TIL_ARBEIDSFORMIDLING"
  | "VEILEDER_TILDELING"
  | "DIALOG_MED_BEHANDLER"
  | "DIALOGMOTEKANDIDAT";

export interface HistorikkEvent {
  opprettetAv?: string;
  tekst: string;
  tidspunkt: Date;
  kilde: HistorikkEventType;
}
