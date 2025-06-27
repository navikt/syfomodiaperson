import { DocumentComponentDto } from "@/data/documentcomponent/documentComponentTypes";
import { Sykepengestopp } from "@/data/pengestopp/types/FlaggPerson";

export interface AvslagUtenForhandsvarsel
  extends ArbeidsuforhetVurdering<VurderingType.AVSLAG_UTEN_FORHANDSVARSEL> {
  vurderingInitiertAv: VurderingInitiertAv;
  gjelderFom: string;
  oppgaveFraNayDato?: string;
}

export interface Forhandsvarsel
  extends ArbeidsuforhetVurdering<VurderingType.FORHANDSVARSEL> {
  frist: Date;
}

export interface IkkeAktuell
  extends ArbeidsuforhetVurdering<VurderingType.IKKE_AKTUELL> {
  arsak: VurderingArsak;
}

export interface Avslag extends ArbeidsuforhetVurdering<VurderingType.AVSLAG> {
  gjelderFom: string;
}

export type Oppfylt = ArbeidsuforhetVurdering<VurderingType.OPPFYLT>;

interface ArbeidsuforhetVurdering<T extends VurderingType> {
  type: T;
  begrunnelse: string;
  document: DocumentComponentDto[];
}

export type ArbeidsuforhetVurderingRequestDTO =
  | AvslagUtenForhandsvarsel
  | Forhandsvarsel
  | IkkeAktuell
  | Avslag
  | Oppfylt;

export enum VurderingType {
  FORHANDSVARSEL = "FORHANDSVARSEL",
  OPPFYLT = "OPPFYLT",
  AVSLAG = "AVSLAG",
  IKKE_AKTUELL = "IKKE_AKTUELL",
  AVSLAG_UTEN_FORHANDSVARSEL = "AVSLAG_UTEN_FORHANDSVARSEL",
  OPPFYLT_UTEN_FORHANDSVARSEL = "OPPFYLT_UTEN_FORHANDSVARSEL",
}

export const typeTexts: {
  [key in VurderingType]: string;
} = {
  [VurderingType.FORHANDSVARSEL]: "Forhåndsvarsel",
  [VurderingType.OPPFYLT]: "Oppfylt",
  [VurderingType.AVSLAG]: "Innstilling om avslag",
  [VurderingType.IKKE_AKTUELL]: "Ikke aktuell",
  [VurderingType.AVSLAG_UTEN_FORHANDSVARSEL]:
    "Innstilling om avslag uten forhåndsvarsel",
  [VurderingType.OPPFYLT_UTEN_FORHANDSVARSEL]: "Oppfylt uten forhåndsvarsel",
};

export enum VurderingArsak {
  FRISKMELDT = "FRISKMELDT",
  FRISKMELDING_TIL_ARBEIDSFORMIDLING = "FRISKMELDING_TIL_ARBEIDSFORMIDLING",
}

export enum VurderingInitiertAv {
  NAV_KONTOR = "NAV_KONTOR",
  NAY = "NAY",
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
  gjelderFom?: string;
  oppgaveFraNayDato?: string;
}
