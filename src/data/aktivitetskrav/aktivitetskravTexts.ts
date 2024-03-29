import {
  AvventVurderingArsak,
  IkkeAktuellArsak,
  OppfyltVurderingArsak,
  UnntakVurderingArsak,
  VurderingArsak,
} from "@/data/aktivitetskrav/aktivitetskravTypes";

export type VurderingArsakTexts = {
  [key in VurderingArsak]?: string;
};

export const oppfyltVurderingArsakTexts: VurderingArsakTexts = {
  [OppfyltVurderingArsak.FRISKMELDT]: "Friskmeldt",
  [OppfyltVurderingArsak.GRADERT]: "Gradert",
  [OppfyltVurderingArsak.TILTAK]: "I tiltak",
};

export const unntakVurderingArsakTexts: VurderingArsakTexts = {
  [UnntakVurderingArsak.MEDISINSKE_GRUNNER]: "Medisinske grunner",
  [UnntakVurderingArsak.TILRETTELEGGING_IKKE_MULIG]:
    "Tilrettelegging ikke mulig",
  [UnntakVurderingArsak.SJOMENN_UTENRIKS]: "Sjømenn i utenriksfart",
};

export const avventVurderingArsakTexts: VurderingArsakTexts = {
  [AvventVurderingArsak.OPPFOLGINGSPLAN_ARBEIDSGIVER]:
    "Har bedt om oppfølgingsplan fra arbeidsgiver",
  [AvventVurderingArsak.INFORMASJON_BEHANDLER]:
    "Har bedt om mer informasjon fra behandler",
  [AvventVurderingArsak.INFORMASJON_SYKMELDT]:
    "Har bedt om informasjon fra den sykemeldte",
  [AvventVurderingArsak.DROFTES_MED_ROL]: "Drøftes med ROL",
  [AvventVurderingArsak.DROFTES_INTERNT]: "Drøftes internt",
  [AvventVurderingArsak.ANNET]: "Annet",
};

export const ikkeAktuellVurderingArsakTexts: VurderingArsakTexts = {
  [IkkeAktuellArsak.INNVILGET_VTA]: "Innbygger er innvilget VTA",
  [IkkeAktuellArsak.MOTTAR_AAP]: "Innbygger mottar AAP",
  [IkkeAktuellArsak.ER_DOD]: "Innbygger er død",
  [IkkeAktuellArsak.ANNET]: "Annet",
};

export const vurderingArsakTexts: VurderingArsakTexts = {
  ...oppfyltVurderingArsakTexts,
  ...unntakVurderingArsakTexts,
  ...avventVurderingArsakTexts,
  ...ikkeAktuellVurderingArsakTexts,
};
