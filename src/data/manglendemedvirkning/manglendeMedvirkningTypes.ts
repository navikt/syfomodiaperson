import { DocumentComponentDto } from "@/data/documentcomponent/documentComponentTypes";

interface VurderingRequestDTO {
  personident: string;
  begrunnelse: string;
  document: DocumentComponentDto[];
}

export interface ForhandsvarselVurdering extends VurderingRequestDTO {
  vurderingType: VurderingType.FORHANDSVARSEL;
  varselSvarfrist: Date;
}

export interface StansVurdering extends VurderingRequestDTO {
  vurderingType: VurderingType.STANS;
  stansdato: Date;
}

export interface OppfyltVurdering extends VurderingRequestDTO {
  vurderingType: VurderingType.OPPFYLT;
}

export interface UnntakVurdering extends VurderingRequestDTO {
  vurderingType: VurderingType.UNNTAK;
}

export interface IkkeAktuellVurdering extends VurderingRequestDTO {
  vurderingType: VurderingType.IKKE_AKTUELL;
}

export type NewVurderingRequestDTO =
  | ForhandsvarselVurdering
  | StansVurdering
  | OppfyltVurdering
  | UnntakVurdering
  | IkkeAktuellVurdering;

export interface VurderingResponseDTO {
  uuid: string;
  personident: string;
  createdAt: Date;
  vurderingType: VurderingType;
  veilederident: string;
  begrunnelse: string;
  stansdato?: Date;
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
