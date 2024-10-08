import { DocumentComponentDto } from "@/data/documentcomponent/documentComponentTypes";

export interface VedtakRequestDTO {
  fom: string;
  tom: string;
  begrunnelse: string;
  document: DocumentComponentDto[];
}

export interface VedtakResponseDTO {
  uuid: string;
  createdAt: Date;
  veilederident: string;
  begrunnelse: string;
  fom: Date;
  tom: Date;
  document: DocumentComponentDto[];
  infotrygdStatus: InfotrygdStatus;
  ferdigbehandletAt?: Date;
  ferdigbehandletBy?: string;
}

export enum InfotrygdStatus {
  IKKE_SENDT = "IKKE_SENDT",
  KVITTERING_MANGLER = "KVITTERING_MANGLER",
  KVITTERING_OK = "KVITTERING_OK",
  KVITTERING_FEIL = "KVITTERING_FEIL",
}
