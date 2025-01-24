export enum UnntakArsak {
  MEDISINSKE_GRUNNER = "MEDISINSKE_GRUNNER",
  INNLEGGELSE_INSTITUSJON = "INNLEGGELSE_INSTITUSJON",
  FRISKMELDT = "FRISKMELDT",
  FORVENTET_FRISKMELDING_INNEN_28UKER = "FORVENTET_FRISKMELDING_INNEN_28UKER",
  DOKUMENTERT_TILTAK_FRISKMELDING = "DOKUMENTERT_TILTAK_FRISKMELDING",
  ARBEIDSFORHOLD_OPPHORT = "ARBEIDSFORHOLD_OPPHORT",
}

export enum CreateUnntakArsak {
  MEDISINSKE_GRUNNER = "MEDISINSKE_GRUNNER",
  INNLEGGELSE_INSTITUSJON = "INNLEGGELSE_INSTITUSJON",
  FORVENTET_FRISKMELDING_INNEN_28UKER = "FORVENTET_FRISKMELDING_INNEN_28UKER",
  DOKUMENTERT_TILTAK_FRISKMELDING = "DOKUMENTERT_TILTAK_FRISKMELDING",
}

export const createUnntakArsakTexts: Record<CreateUnntakArsak, string> = {
  [UnntakArsak.MEDISINSKE_GRUNNER]: "Medisinske grunner",
  [UnntakArsak.INNLEGGELSE_INSTITUSJON]: "Innleggelse i helseinstitusjon",
  [UnntakArsak.FORVENTET_FRISKMELDING_INNEN_28UKER]:
    "Forventet friskmelding innen 28 ukers sykmelding",
  [UnntakArsak.DOKUMENTERT_TILTAK_FRISKMELDING]:
    "Tiltak som sannsynligvis vil føre til en friskmelding",
};

export const unntakArsakTexts: Record<UnntakArsak, string> = {
  ...createUnntakArsakTexts,
  [UnntakArsak.FRISKMELDT]: "Friskmeldt",
  [UnntakArsak.ARBEIDSFORHOLD_OPPHORT]: "Arbeidsforholdet er opphørt",
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
  arsak: CreateUnntakArsak;
  beskrivelse?: string;
}
