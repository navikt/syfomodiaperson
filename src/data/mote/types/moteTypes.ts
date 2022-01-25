export interface TidOgStedDTO {
  id: number;
  tid: Date;
  created: Date;
  sted: string;
  valgt: boolean;
}

export interface MoteAlternativDTO {
  id: number;
  tid: Date;
  created: Date;
  sted: string;
  valgt: boolean;
}

export interface MoteSvarDTO {
  id: number;
  tid: Date;
  created: Date;
  sted: string;
  valgt: boolean;
}

export interface MoteDeltakerDTO {
  navn: string;
  orgnummer: string;
  type: MotedeltakerType;
  svar: MoteSvarDTO[];
  svartidspunkt: Date;
}

export interface MoteDTO {
  moteUuid: string;
  opprettetAv: string;
  aktorId: string;
  status: string;
  fnr?: string;
  opprettetTidspunkt: Date;
  bekreftetTidspunkt?: Date;
  navEnhet: string;
  eier: string;
  deltakere: MoteDeltakerDTO[];
  bekreftetAlternativ?: TidOgStedDTO;
  alternativer: MoteAlternativDTO[];
  sistEndret: Date;
  trengerBehandling: boolean;
}

export enum MotedeltakerType {
  BRUKER = "Bruker",
  ARBEIDSGIVER = "arbeidsgiver",
  NAV_VEILEDER = "NAV-veileder",
}
