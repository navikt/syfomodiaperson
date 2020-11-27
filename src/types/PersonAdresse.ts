export interface PersonAdresse {
  navn: string;
  bostedsadresse?: Bostedsadresse;
  kontaktadresse?: Kontaktadresse;
  oppholdsadresse?: Oppholdsadresse;
}

export interface Bostedsadresse {
  angittFlyttedato?: Date;
  gyldigFraOgMed?: Date;
  gyldigTilOgMed?: Date;
  coAdressenavn?: string;
  vegadresse?: Vegadresse;
  matrikkeladresse?: Matrikkeladresse;
  utenlandskAdresse?: UtenlandskAdresse;
  ukjentBosted?: UkjentBosted;
}

export interface Kontaktadresse {
  gyldigFraOgMed?: Date;
  gyldigTilOgMed?: Date;
  type: KontaktadresseType;
  coAdressenavn?: string;
  postboksadresse?: Postboksadresse;
  vegadresse?: Vegadresse;
  postadresseIFrittFormat?: PostadresseIFrittFormat;
  utenlandskAdresse?: UtenlandskAdresse;
  utenlandskAdresseIFrittFormat?: UtenlandskAdresseIFrittFormat;
}

enum KontaktadresseType {
  Innland,
  Utland,
}

export interface Oppholdsadresse {
  gyldigFraOgMed?: Date;
  gyldigTilOgMed?: Date;
  coAdressenavn?: string;
  utenlandskAdresse?: UtenlandskAdresse;
  vegadresse?: Vegadresse;
  matrikkeladresse?: Matrikkeladresse;
  oppholdAnnetSted?: string;
}

export interface PostadresseIFrittFormat {
  adresselinje1?: string;
  adresselinje2?: string;
  adresselinje3?: string;
  postnummer?: string;
}

export interface Postboksadresse {
  postbokseier?: string;
  postboks: string;
  postnummer?: string;
}

export interface UtenlandskAdresse {
  adressenavnNummer?: string;
  bygningEtasjeLeilighet?: string;
  postboksNummerNavn?: string;
  postkode?: string;
  bySted?: string;
  regionDistriktOmraade?: string;
  landkode: string;
}

export interface UtenlandskAdresseIFrittFormat {
  adresselinje1?: string;
  adresselinje2?: string;
  adresselinje3?: string;
  postkode?: string;
  byEllerStedsnavn?: string;
  landkode: string;
}

export interface Vegadresse {
  matrikkelId?: bigint;
  husnummer?: string;
  husbokstav?: string;
  bruksenhetsnummer?: string;
  adressenavn?: string;
  kommunenummer?: string;
  bydelsnummer?: string;
  tilleggsnavn?: string;
  postnummer?: string;
}

export interface Matrikkeladresse {
  matrikkelId?: bigint;
  bruksenhetsnummer?: string;
  tilleggsnavn?: string;
  postnummer?: string;
  kommunenummer?: string;
}

export interface UkjentBosted {
  bostedskommune?: string;
}
