export interface DialogmotekandidatDTO {
  readonly kandidat: boolean;
  readonly kandidatAt?: string;
}

export interface DialogmotekandidatHistorikkDTO {
  tidspunkt: Date;
  type: HistorikkType;
  vurdertAv: string | null;
}

export enum HistorikkType {
  KANDIDAT = "KANDIDAT",
  UNNTAK = "UNNTAK",
  IKKE_AKTUELL = "IKKE_AKTUELL",
  LUKKET = "LUKKET",
}
