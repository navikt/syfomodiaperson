export interface Arbeidsgiver {
  navn: string;
  orgnummer: string;
}

export interface Periode {
  tom: Date;
}

export interface Sykmelding {
  arbeidsgiver: string;
  orgnummer: string;
  pasient: {
    fnr: string;
  };
  mulighetForArbeid: {
    perioder: Periode[];
  };
  status: String;
}

export interface SykmeldtFnr {
  value: string;
}

export interface VirksomhetNr {
  value: string;
}

export interface VeilederIdent {
  value: string;
}

export interface EnhetNr {
  value: string;
}

export interface StoppAutomatikk {
  sykmeldtFnr: SykmeldtFnr;
  virksomhetNr: VirksomhetNr[];
  enhetNr: EnhetNr;
}

export enum Status {
  NORMAL = "NORMAL",
  STOPP_AUTOMATIKK = "STOPP_AUTOMATIKK",
}

export interface StatusEndring {
  veilederIdent: VeilederIdent;
  sykmeldtFnr: SykmeldtFnr;
  status: Status;
  virksomhetNr: VirksomhetNr;
  opprettet: string;
  enhetNr: EnhetNr;
}
