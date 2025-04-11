export interface BehandlendeEnhetResponseDTO {
  geografiskEnhet: Enhet;
  oppfolgingsenhet: Enhet;
}

export interface Enhet {
  enhetId: string;
  navn: string;
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
