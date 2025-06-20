import { DocumentComponentDto } from "@/data/documentcomponent/documentComponentTypes";
import { Sykepengestopp } from "@/data/pengestopp/types/FlaggPerson";

export interface VurderingRequestDTO {
  type: VurderingType;
  arsak?: VurderingArsak;
  begrunnelse: string;
  document: DocumentComponentDto[];
  gjelderFom?: string;
  frist?: Date;
  oppgaveFraNayDato?: string;
}

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
  SYKEPENGER_IKKE_UTBETALT = "SYKEPENGER_IKKE_UTBETALT",
  NAY_BER_OM_NY_VURDERING = "NAY_BER_OM_NY_VURDERING",
}

export const arsakTexts: {
  [key in VurderingArsak]: string;
} = {
  [VurderingArsak.FRISKMELDT]: "Friskmeldt",
  [VurderingArsak.FRISKMELDING_TIL_ARBEIDSFORMIDLING]:
    "Friskmelding til arbeidsformidling",
  [VurderingArsak.SYKEPENGER_IKKE_UTBETALT]: "Sykepenger ikke utbetalt",
  [VurderingArsak.NAY_BER_OM_NY_VURDERING]: "NAY ber om ny vurdering",
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
