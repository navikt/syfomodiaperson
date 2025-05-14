export interface BehandlendeEnhetResponseDTO {
  geografiskEnhet: Enhet;
  oppfolgingsenhetDTO: OppfolgingsenhetDTO | null;
}

export interface Enhet {
  enhetId: string;
  navn: string;
}

export interface OppfolgingsenhetDTO {
  enhet: Enhet;
  createdAt: Date;
  veilederident: string;
}

export interface TildelOppfolgingsenhetRequestDTO {
  personidenter: string[];
  oppfolgingsenhet: string;
}

export interface TildelOppfolgingsenhetResponseDTO {
  tildelinger: TildelOppfolgingsenhetDTO[];
  errors: ErrorDTO[];
}

export interface TildelOppfolgingsenhetDTO {
  personident: string;
  oppfolgingsenhet: string | null;
}

export interface ErrorDTO {
  personident: string;
  errorMessage: string | null;
  errorCode: number | null;
}
