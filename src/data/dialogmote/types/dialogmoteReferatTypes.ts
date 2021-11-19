import { DocumentComponentDto } from "./dialogmoteTypes";

export interface ReferatDTO {
  readonly uuid: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly digitalt: boolean;
  readonly situasjon: string;
  readonly konklusjon: string;
  readonly arbeidstakerOppgave: string;
  readonly arbeidsgiverOppgave: string;
  readonly veilederOppgave?: string;
  readonly document: DocumentComponentDto[];
  readonly lestDatoArbeidstaker?: string;
  readonly lestDatoArbeidsgiver?: string;
  readonly andreDeltakere: DialogmotedeltakerAnnenDTO[];
}

export interface DialogmotedeltakerAnnenDTO {
  readonly uuid: string;
  readonly createdAt: string;
  readonly updatedAt: string;
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
