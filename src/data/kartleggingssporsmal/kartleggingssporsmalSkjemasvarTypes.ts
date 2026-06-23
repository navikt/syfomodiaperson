export interface KartleggingssporsmalFormSnapshot {
  formIdentifier: string;
  formSemanticVersion: string;
  fieldSnapshots: KartleggingssporsmalFieldSnapshotUnion[];
}

export type KartleggingssporsmalFieldSnapshotUnion =
  | KartleggingssporsmalRadioGroupFieldSnapshot
  | KartleggingssporsmalTextFieldSnapshot;

export interface KartleggingssporsmalFieldSnapshot {
  fieldId: string;
  label: string;
  description: string | null;
  fieldType: KartleggingssporsmalFormSnapshotFieldType;
}

export enum KartleggingssporsmalFormSnapshotFieldType {
  RADIO_GROUP = "RADIO_GROUP",
  TEXT = "TEXT",
}

export interface KartleggingssporsmalRadioGroupFieldSnapshot extends KartleggingssporsmalFieldSnapshot {
  fieldType: KartleggingssporsmalFormSnapshotFieldType.RADIO_GROUP;
  options: KartleggingssporsmalFormSnapshotFieldOption[];
  wasRequired: boolean | null;
}

export interface KartleggingssporsmalTextFieldSnapshot extends KartleggingssporsmalFieldSnapshot {
  fieldType: KartleggingssporsmalFormSnapshotFieldType.TEXT;
  value: string;
  wasRequired: boolean | null;
}

export interface KartleggingssporsmalFormSnapshotFieldOption {
  optionId: string;
  optionLabel: string;
  wasSelected: boolean;
}
