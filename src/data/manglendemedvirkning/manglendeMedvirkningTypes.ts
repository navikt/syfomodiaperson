import { DocumentComponentDto } from "@/data/documentcomponent/documentComponentTypes";

export interface NewVurderingRequestDTO {
  personident: string;
  vurderingType: VurderingType;
  begrunnelse: string;
  document: DocumentComponentDto[];
  varselSvarfrist: Date;
}

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
  IKKE_AKTUELL = "IKKE_AKTUELL",
}
