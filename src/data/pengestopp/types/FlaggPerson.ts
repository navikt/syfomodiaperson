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
  status: string;
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

/* Skal ikke lenger kunne velges (fra april 24). Oppgavene er overført fra NAV-kontor til NAY. */
export enum DeprecatedSykepengestoppArsakType {
  BESTRIDELSE_SYKMELDING = "BESTRIDELSE_SYKMELDING",
  TILBAKEDATERT_SYKMELDING = "TILBAKEDATERT_SYKMELDING",
}

export enum ValidSykepengestoppArsakType {
  MEDISINSK_VILKAR = "MEDISINSK_VILKAR",
  AKTIVITETSKRAV = "AKTIVITETSKRAV",
  MANGLENDE_MEDVIRKING = "MANGLENDE_MEDVIRKING",
}

export type SykepengestoppArsakType =
  | DeprecatedSykepengestoppArsakType
  | ValidSykepengestoppArsakType;

export const validSykepengestoppArsakTekster: Record<
  ValidSykepengestoppArsakType,
  string
> = {
  [ValidSykepengestoppArsakType.MEDISINSK_VILKAR]:
    "Medisinsk vilkår (§ 8-4 første ledd)",
  [ValidSykepengestoppArsakType.MANGLENDE_MEDVIRKING]:
    "Manglende medvirkning (§ 8-8 første ledd)",
  [ValidSykepengestoppArsakType.AKTIVITETSKRAV]:
    "Aktivitetskravet (§ 8-8 andre ledd)",
};

export const sykepengestoppArsakTekster: Record<
  SykepengestoppArsakType,
  string
> = {
  ...validSykepengestoppArsakTekster,
  [DeprecatedSykepengestoppArsakType.BESTRIDELSE_SYKMELDING]:
    "Bestridelse av sykmelding (§ 8-4 første ledd)",
  [DeprecatedSykepengestoppArsakType.TILBAKEDATERT_SYKMELDING]:
    "Tilbakedatert sykmelding (§ 8-7)",
};

export interface SykepengestoppArsak {
  type: SykepengestoppArsakType;
}

export interface StoppAutomatikk {
  sykmeldtFnr: SykmeldtFnr;
  arsakList: SykepengestoppArsak[];
  virksomhetNr: VirksomhetNr[];
  enhetNr: EnhetNr;
}

export enum Status {
  NORMAL = "NORMAL",
  STOPP_AUTOMATIKK = "STOPP_AUTOMATIKK",
}

export interface Sykepengestopp {
  veilederIdent: VeilederIdent;
  sykmeldtFnr: SykmeldtFnr;
  arsakList: SykepengestoppArsak[];
  status: Status;
  virksomhetNr: VirksomhetNr | undefined;
  opprettet: string;
  enhetNr: EnhetNr | undefined;
}
