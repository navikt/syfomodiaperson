import { DocumentComponentDto } from "./dialogmoteTypes";

export interface ReferatDTO {
  readonly uuid: string;
  readonly ferdigstilt: boolean;
  readonly narmesteLederNavn: string;
  readonly situasjon: string;
  readonly konklusjon: string;
  readonly arbeidstakerOppgave: string;
  readonly arbeidsgiverOppgave: string;
  readonly veilederOppgave?: string;
  readonly behandlerOppgave?: string;
  readonly document: DocumentComponentDto[];
  readonly andreDeltakere: DialogmotedeltakerAnnenDTO[];
}

export interface DialogmotedeltakerAnnenDTO {
  readonly funksjon: string;
  readonly navn: string;
}

export type NewDialogmotedeltakerAnnenDTO = Pick<
  DialogmotedeltakerAnnenDTO,
  "funksjon" | "navn"
>;

export interface NewDialogmoteReferatDTO {
  narmesteLederNavn: string;
  situasjon: string;
  konklusjon: string;
  arbeidstakerOppgave: string;
  arbeidsgiverOppgave: string;
  behandlerOppgave?: string;
  veilederOppgave?: string;
  document: DocumentComponentDto[];
  andreDeltakere: NewDialogmotedeltakerAnnenDTO[];
}
