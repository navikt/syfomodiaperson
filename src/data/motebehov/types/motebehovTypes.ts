export interface MotebehovVeilederDTO {
  id: string;
  opprettetDato: Date;
  opprettetAvNavn: string | null;
  arbeidstakerFnr: string;
  virksomhetsnummer: string;
  behandletTidspunkt: Date | null;
  behandletVeilederIdent: string | null;
  innmelderType: MotebehovInnmelder;
  skjemaType: MotebehovSkjemaType;
  formValues: MotebehovFormValuesOutputDTO;
}

export type Virksomhetsnummer = string;
export type InnsenderKey = [Virksomhetsnummer, MotebehovInnmelder];

export interface MotebehovFormValuesOutputDTO {
  harMotebehov: boolean;
  formSnapshot: FormSnapshot | null;
  begrunnelse: string | null;
  onskerSykmelderDeltar: boolean | null;
  onskerSykmelderDeltarBegrunnelse: string | null;
  onskerTolk: boolean | null;
  tolkSprak: string | null;
}

export interface FormSnapshot {
  formIdentifier: FormIdentifier;
  formSemanticVersion: string;
  fieldSnapshots: FieldSnapshot[];
}

export enum FormIdentifier {
  MOTEBEHOV_ARBEIDSGIVER_SVAR = "motebehov-arbeidsgiver-svar",
  MOTEBEHOV_ARBEIDSGIVER_MELD = "motebehov-arbeidsgiver-meld",
  MOTEBEHOV_ARBEIDSTAKER_SVAR = "motebehov-arbeidstaker-svar",
  MOTEBEHOV_ARBEIDSTAKER_MELD = "motebehov-arbeidstaker-meld",
}

export interface FieldSnapshot {
  fieldId: string;
  label: string;
  description: string | null;
  fieldType: FormSnapshotFieldType;
}

export enum FormSnapshotFieldType {
  TEXT = "TEXT",
  CHECKBOX_SINGLE = "CHECKBOX_SINGLE",
  RADIO_GROUP = "RADIO_GROUP",
}

export interface TextFieldSnapshot extends FieldSnapshot {
  value: string;
  wasRequired: boolean | null;
}

export interface SingleCheckboxFieldSnapshot extends FieldSnapshot {
  value: boolean;
}

export interface RadioGroupFieldSnapshot extends FieldSnapshot {
  selectedOptionId: string;
  selectedOptionLabel: string;
  options: FormSnapshotFieldOption[];
  wasRequired: boolean | null;
}

export interface FormSnapshotFieldOption {
  optionId: string;
  optionLabel: string;
  wasSelected: boolean;
}

export enum MotebehovSkjemaType {
  MELD_BEHOV = "MELD_BEHOV",
  SVAR_BEHOV = "SVAR_BEHOV",
}

export interface MeldtMotebehov {
  id: string;
  opprettetDato: Date;
  opprettetAvNavn: string | null;
  innmelder: MotebehovInnmelder;
  arbeidstakerFnr: string;
  virksomhetsnummer: string;
  behandletTidspunkt: Date | null;
  behandletVeilederIdent: string | null;
  skjemaType: MotebehovSkjemaType.MELD_BEHOV;
  formValues: MotebehovFormValuesOutputDTO;
}

export interface SvarMotebehov {
  id: string;
  opprettetDato: Date;
  opprettetAvNavn: string | null;
  innmelder: MotebehovInnmelder;
  arbeidstakerFnr: string;
  virksomhetsnummer: string;
  behandletTidspunkt: Date | null;
  behandletVeilederIdent: string | null;
  skjemaType: MotebehovSkjemaType.SVAR_BEHOV;
  formValues: MotebehovFormValuesOutputDTO;
}

export enum MotebehovInnmelder {
  ARBEIDSTAKER = "ARBEIDSTAKER",
  ARBEIDSGIVER = "ARBEIDSGIVER",
}
