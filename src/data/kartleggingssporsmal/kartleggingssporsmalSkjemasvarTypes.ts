export interface KartleggingssporsmalFormSnapshot {
  formSemanticVersion: string;
  fieldSnapshots: KartleggingssporsmalFieldSnapshot[];
}

export interface KartleggingssporsmalFieldSnapshot {
  fieldId: string;
  label: string;
  description: string | null;
  fieldType: KartleggingssporsmalFormSnapshotFieldType;
}

export enum KartleggingssporsmalFormSnapshotFieldType {
  TEXT = "TEXT",
  CHECKBOX_SINGLE = "CHECKBOX_SINGLE",
  RADIO_GROUP = "RADIO_GROUP",
}

export interface KartleggingssporsmalTextFieldSnapshot
  extends KartleggingssporsmalFieldSnapshot {
  value: string;
  wasRequired: boolean | null;
}

export interface KartleggingssporsmalSingleCheckboxFieldSnapshot
  extends KartleggingssporsmalFieldSnapshot {
  value: boolean;
}

export interface KartleggingssporsmalRadioGroupFieldSnapshot
  extends KartleggingssporsmalFieldSnapshot {
  options: KartleggingssporsmalFormSnapshotFieldOption[];
  wasRequired: boolean | null;
}

export interface KartleggingssporsmalFormSnapshotFieldOption {
  optionId: string;
  optionLabel: string;
  wasSelected: boolean;
}
