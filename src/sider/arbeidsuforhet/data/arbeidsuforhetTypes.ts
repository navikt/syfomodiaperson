import { DocumentComponentDto } from "@/data/documentcomponent/documentComponentTypes";
import { Sykepengestopp } from "@/data/pengestopp/types/FlaggPerson";

export interface VurderingRequestDTO {
  type: VurderingType;
  arsak?: VurderingArsak;
  begrunnelse: string;
  document: DocumentComponentDto[];
  gjelderFom?: string;
  frist?: Date;
}

export enum VurderingType {
  FORHANDSVARSEL = "FORHANDSVARSEL",
  OPPFYLT = "OPPFYLT",
  AVSLAG = "AVSLAG",
  IKKE_AKTUELL = "IKKE_AKTUELL",
}

export const typeTexts: {
  [key in VurderingType]: string;
} = {
  [VurderingType.FORHANDSVARSEL]: "Forhåndsvarsel",
  [VurderingType.OPPFYLT]: "Oppfylt",
  [VurderingType.AVSLAG]: "Innstilling om avslag",
  [VurderingType.IKKE_AKTUELL]: "Ikke aktuell",
};

export enum VurderingArsak {
  FRISKMELDT = "FRISKMELDT",
  FRISKMELDING_TIL_ARBEIDSFORMIDLING = "FRISKMELDING_TIL_ARBEIDSFORMIDLING",
}

export const arsakTexts: {
  [key in VurderingArsak]: string;
} = {
  [VurderingArsak.FRISKMELDT]: "Friskmeldt",
  [VurderingArsak.FRISKMELDING_TIL_ARBEIDSFORMIDLING]:
    "Friskmelding til arbeidsformidling",
};

export interface VarselDTO {
  uuid: string;
  createdAt: Date;
  svarfrist: Date;
  isExpired: boolean;
}

export type HistorikkEntry = VurderingResponseDTO | Sykepengestopp;

export interface VurderingResponseDTO {
  uuid: string;
  personident: string;
  createdAt: Date;
  veilederident: string;
  type: VurderingType;
  arsak: VurderingArsak | undefined;
  begrunnelse: string;
  document: DocumentComponentDto[];
  varsel: VarselDTO | undefined;
}
