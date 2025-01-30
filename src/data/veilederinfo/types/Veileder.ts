export interface Veileder {
  ident: string;
  fornavn: string;
  etternavn: string;
  epost: string;
  telefonnummer?: string;
  enabled: boolean | null;
}

export class Veileder {
  ident: string;
  fornavn: string;
  etternavn: string;
  epost: string;
  telefonnummer?: string;
  enabled: boolean | null;

  constructor(
    ident: string,
    fornavn: string,
    etternavn: string,
    epost: string,
    enabled: boolean | null,
    telefonnummer?: string
  ) {
    this.ident = ident;
    this.fornavn = fornavn;
    this.etternavn = etternavn;
    this.epost = epost;
    this.telefonnummer = telefonnummer;
    this.enabled = enabled;
  }

  fulltNavn(): string {
    return this.fornavn + " " + this.etternavn;
  }
}
