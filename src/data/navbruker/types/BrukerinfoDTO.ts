export interface ReservasjonDTO {
  skalHaVarsel: boolean;
  feilAarsak?: string;
}

export interface KontaktinfoDTO {
  epost?: string;
  tlf?: string;
  reservasjon?: ReservasjonDTO;
}

export interface BrukerinfoDTO {
  navn: string;
  kontaktinfo?: KontaktinfoDTO;
}
