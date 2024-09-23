import { DocumentComponentDto } from "@/data/documentcomponent/documentComponentTypes";

interface VurderingRequestDTO {
  personident: string;
  begrunnelse: string;
  document: DocumentComponentDto[];
}

export interface NewForhandsvarselVurderingRequestDTO
  extends VurderingRequestDTO {
  vurderingType: VurderingType.FORHANDSVARSEL;
  varselSvarfrist: Date;
}

export interface NewFinalVurderingRequestDTO extends VurderingRequestDTO {
  vurderingType:
    | VurderingType.OPPFYLT
    | VurderingType.STANS
    | VurderingType.UNNTAK
    | VurderingType.IKKE_AKTUELL;
}

export type NewVurderingRequestDTO =
  | NewForhandsvarselVurderingRequestDTO
  | NewFinalVurderingRequestDTO;

export interface VurderingResponseDTO {
  uuid: string;
  personident: string;
  createdAt: Date;
  vurderingType: VurderingType;
  veilederident: string;
  begrunnelse: string;
  document: DocumentComponentDto[];
  varsel: Varsel | null;
}

interface Varsel {
  uuid: string;
  createdAt: Date;
  svarfrist: Date;
}

export enum VurderingType {
  FORHANDSVARSEL = "FORHANDSVARSEL",
  OPPFYLT = "OPPFYLT",
  STANS = "STANS",
  UNNTAK = "UNNTAK",
  IKKE_AKTUELL = "IKKE_AKTUELL",
}

export const typeTexts: {
  [key in VurderingType]: string;
} = {
  [VurderingType.FORHANDSVARSEL]: "Forhåndsvarsel",
  [VurderingType.OPPFYLT]: "Oppfylt",
  [VurderingType.STANS]: "Stans",
  [VurderingType.IKKE_AKTUELL]: "Ikke aktuell",
  [VurderingType.UNNTAK]: "Unntak",
};
