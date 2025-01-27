export enum ValidUnntakArsak {
  MEDISINSKE_GRUNNER = "MEDISINSKE_GRUNNER",
  INNLEGGELSE_INSTITUSJON = "INNLEGGELSE_INSTITUSJON",
  FORVENTET_FRISKMELDING_INNEN_28UKER = "FORVENTET_FRISKMELDING_INNEN_28UKER",
  DOKUMENTERT_TILTAK_FRISKMELDING = "DOKUMENTERT_TILTAK_FRISKMELDING",
}

export enum DeprecatedUnntakArsak {
  FRISKMELDT = "FRISKMELDT",
  ARBEIDSFORHOLD_OPPHORT = "ARBEIDSFORHOLD_OPPHORT",
}

export type UnntakArsak = ValidUnntakArsak | DeprecatedUnntakArsak;

export const createUnntakArsakTexts: Record<ValidUnntakArsak, string> = {
  [ValidUnntakArsak.MEDISINSKE_GRUNNER]: "Medisinske grunner",
  [ValidUnntakArsak.INNLEGGELSE_INSTITUSJON]: "Innleggelse i helseinstitusjon",
  [ValidUnntakArsak.FORVENTET_FRISKMELDING_INNEN_28UKER]:
    "Forventet friskmelding innen 28 ukers sykmelding",
  [ValidUnntakArsak.DOKUMENTERT_TILTAK_FRISKMELDING]:
    "Tiltak som sannsynligvis vil føre til en friskmelding",
};

export const unntakArsakTexts: Record<UnntakArsak, string> = {
  ...createUnntakArsakTexts,
  [DeprecatedUnntakArsak.FRISKMELDT]: "Friskmeldt",
  [DeprecatedUnntakArsak.ARBEIDSFORHOLD_OPPHORT]: "Arbeidsforholdet er opphørt",
};

export interface UnntakDTO {
  uuid: string;
  createdAt: Date;
  createdBy: string;
  personIdent: string;
  arsak: UnntakArsak;
  beskrivelse?: string;
}

export interface CreateUnntakDTO {
  personIdent: string;
  arsak: ValidUnntakArsak;
  beskrivelse?: string;
}
