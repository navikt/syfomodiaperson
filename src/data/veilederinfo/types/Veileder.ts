export interface Veileder {
  ident: string;
  fornavn: string;
  etternavn: string;
  enabled: boolean | null;
}

export class Veileder {
  ident: string;
  fornavn: string;
  etternavn: string;
  enabled: boolean | null;

  constructor(
    ident: string,
    fornavn: string,
    etternavn: string,
    enabled: boolean | null
  ) {
    this.ident = ident;
    this.fornavn = fornavn;
    this.etternavn = etternavn;
    this.enabled = enabled;
  }

  fulltNavn(): string {
    return this.fornavn + " " + this.etternavn;
  }
}
