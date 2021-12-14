import { ReferatDTO } from "./dialogmoteReferatTypes";
import { BehandlerType } from "@/data/behandlerdialogmelding/BehandlerDialogmeldingDTO";

export enum MotedeltakerVarselType {
  AVLYST = "AVLYST",
  INNKALT = "INNKALT",
  REFERAT = "REFERAT",
  NYTT_TID_STED = "NYTT_TID_STED",
}

export interface DialogmotedeltakerVarselDTO {
  readonly uuid: string;
  readonly createdAt: string;
  readonly lestDato?: string;
  readonly varselType: MotedeltakerVarselType;
  readonly fritekst: string;
  readonly document: DocumentComponentDto[];
}

export interface DialogmotedeltakerArbeidstakerVarselDTO
  extends DialogmotedeltakerVarselDTO {
  readonly digitalt: boolean;
}

export interface DialogmotedeltakerArbeidsgiverVarselDTO
  extends DialogmotedeltakerVarselDTO {
  readonly status: string;
}

export interface DialogmotedeltakerBehandlerVarselDTO
  extends Omit<DialogmotedeltakerVarselDTO, "lestDato"> {
  readonly svar: DialogmotedeltakerBehandlerVarselSvarDTO[];
}

export interface DialogmotedeltakerBehandlerVarselSvarDTO
  extends VarselSvarDTO {
  readonly uuid: string;
}

export interface VarselSvarDTO {
  readonly createdAt: string;
  readonly svarType: SvarType;
  readonly tekst?: string;
}

export enum SvarType {
  KOMMER = "KOMMER",
  NYTT_TID_STED = "NYTT_TID_STED",
  KOMMER_IKKE = "KOMMER_IKKE",
}

export enum DocumentComponentType {
  HEADER = "HEADER",
  PARAGRAPH = "PARAGRAPH",
  LINK = "LINK",
}

export interface DocumentComponentDto {
  readonly type: DocumentComponentType;
  readonly key?: string;
  readonly title?: string;
  readonly texts: string[];
}

export enum DialogmoteStatus {
  INNKALT = "INNKALT",
  AVLYST = "AVLYST",
  FERDIGSTILT = "FERDIGSTILT",
  NYTT_TID_STED = "NYTT_TID_STED",
}

export interface DialogmotedeltakerArbeidstakerDTO {
  readonly personIdent: string;
  readonly type: string;
  readonly varselList: DialogmotedeltakerArbeidstakerVarselDTO[];
}

export interface DialogmotedeltakerArbeidsgiverDTO {
  readonly virksomhetsnummer: string;
  readonly type: string;
  readonly varselList: DialogmotedeltakerArbeidsgiverVarselDTO[];
}

export interface DialogmotedeltakerBehandlerDTO {
  readonly uuid: string;
  readonly personIdent?: string;
  readonly behandlerRef: string;
  readonly behandlerNavn: string;
  readonly behandlerKontor: string;
  readonly behandlerType: BehandlerType;
  readonly type: string;
  readonly varselList: DialogmotedeltakerBehandlerVarselDTO[];
}

export interface DialogmoteInnkallingDTO {
  tildeltEnhet: string;
  arbeidstaker: {
    personIdent: string;
    fritekstInnkalling?: string;
    innkalling: DocumentComponentDto[];
  };
  arbeidsgiver: {
    virksomhetsnummer: string;
    fritekstInnkalling?: string;
    innkalling: DocumentComponentDto[];
  };
  behandler?: {
    personIdent?: string;
    behandlerRef: string;
    behandlerNavn: string;
    behandlerKontor: string;
    fritekstInnkalling?: string;
    innkalling: DocumentComponentDto[];
  };
  tidSted: {
    sted: string;
    tid: string;
    videoLink?: string;
  };
}

export interface EndreTidStedDialogmoteDTO {
  sted: string;
  tid: string;
  videoLink?: string;
  arbeidstaker: {
    begrunnelse: string;
    endringsdokument: DocumentComponentDto[];
  };
  arbeidsgiver: {
    begrunnelse: string;
    endringsdokument: DocumentComponentDto[];
  };
  behandler?: {
    begrunnelse: string;
    endringsdokument: DocumentComponentDto[];
  };
}

export interface AvlysDialogmoteDTO {
  arbeidstaker: AvlysningDto;
  arbeidsgiver: AvlysningDto;
  behandler?: AvlysningDto;
}

interface AvlysningDto {
  begrunnelse: string;
  avlysning: DocumentComponentDto[];
}

export interface DialogmoteDTO {
  readonly uuid: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly planlagtMoteBekreftetTidspunkt?: string;
  readonly status: DialogmoteStatus;
  readonly opprettetAv: string;
  readonly tildeltVeilederIdent: string;
  readonly tildeltEnhet: string;
  readonly arbeidstaker: DialogmotedeltakerArbeidstakerDTO;
  readonly arbeidsgiver: DialogmotedeltakerArbeidsgiverDTO;
  readonly behandler?: DialogmotedeltakerBehandlerDTO;
  readonly sted: string;
  readonly tid: string;
  readonly videoLink?: string;
  readonly referat?: ReferatDTO;
}
