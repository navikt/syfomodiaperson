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
