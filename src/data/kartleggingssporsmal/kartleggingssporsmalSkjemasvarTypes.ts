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
  RADIO_GROUP = "RADIO_GROUP",
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
