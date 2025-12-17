export interface DialogmotekandidatDTO {
  readonly kandidat: boolean;
  readonly kandidatAt?: string;
}

export interface DialogmotekandidatHistorikkDTO {
  tidspunkt: Date;
  type: HistorikkType;
  vurdertAv: string | null;
}

export interface CreateAvventDTO {
  personIdent: string;
  frist: string;
  beskrivelse: string | undefined;
}

export interface AvventDTO {
  frist: string;
  createdBy: string;
  beskrivelse: string | null;
}

export enum HistorikkType {
  KANDIDAT = "KANDIDAT",
  UNNTAK = "UNNTAK",
  IKKE_AKTUELL = "IKKE_AKTUELL",
  LUKKET = "LUKKET",
}
