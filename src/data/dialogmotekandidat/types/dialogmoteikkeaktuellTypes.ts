export enum IkkeAktuellArsak {
  ARBEIDSTAKER_AAP = "ARBEIDSTAKER_AAP",
  ARBEIDSTAKER_DOD = "ARBEIDSTAKER_DOD",
  DIALOGMOTE_AVHOLDT = "DIALOGMOTE_AVHOLDT",
  FRISKMELDT = "FRISKMELDT",
  ARBEIDSFORHOLD_OPPHORT = "ARBEIDSFORHOLD_OPPHORT",
}

export interface CreateIkkeAktuellDTO {
  personIdent: string;
  arsak: IkkeAktuellArsak;
  beskrivelse?: string;
}

export const ikkeAktuellArsakTexts: Record<IkkeAktuellArsak, string> = {
  [IkkeAktuellArsak.ARBEIDSTAKER_AAP]: "Innbygger mottar AAP",
  [IkkeAktuellArsak.ARBEIDSTAKER_DOD]: "Innbygger er død",
  [IkkeAktuellArsak.DIALOGMOTE_AVHOLDT]: "Dialogmøte avholdt",
  [IkkeAktuellArsak.FRISKMELDT]: "Friskmeldt",
  [IkkeAktuellArsak.ARBEIDSFORHOLD_OPPHORT]: "Arbeidsforholdet er opphørt",
};
