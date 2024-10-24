export type HistorikkKilde = "MOTER" | "MOTEBEHOV" | "OPPFOLGINGSPLAN";
export type HistorikkEventType =
  | HistorikkKilde
  | "LEDER"
  | "AKTIVITETSKRAV"
  | "ARBEIDSUFORHET"
  | "MANGLENDE_MEDVIRKNING"
  | "FRISKMELDING_TIL_ARBEIDSFORMIDLING";

export interface HistorikkEvent {
  opprettetAv?: string;
  tekst: string;
  tidspunkt: Date;
  kilde: HistorikkEventType;
}
