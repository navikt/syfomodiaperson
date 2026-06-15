import { KartleggingssporsmalSvarResponseDTO } from "@/data/kartleggingssporsmal/kartleggingssporsmalTypes.ts";
import { KartleggingssporsmalFormSnapshotFieldType } from "@/data/kartleggingssporsmal/kartleggingssporsmalSkjemasvarTypes.ts";

export function hasRisikoForLangtidsfravar(
  answeredQuestions: KartleggingssporsmalSvarResponseDTO
): boolean {
  const fieldSnapshots = answeredQuestions.formSnapshot.fieldSnapshots;
  if (!fieldSnapshots) return false;

  const radioFieldSnapshots = fieldSnapshots.filter(
    (field) =>
      field?.fieldType === KartleggingssporsmalFormSnapshotFieldType.RADIO_GROUP
  );

  const someLowRiskOptionInSnapshotNotSelected = radioFieldSnapshots.some(
    (radioFieldSnapshot) => {
      if (!isKnownRadioFieldId(radioFieldSnapshot.fieldId)) return false;
      const lowRiskOptionIdForField =
        lowRiskOptionIdByRadioFieldId[radioFieldSnapshot.fieldId];

      const lowRiskOptionFoundInSnapshot = radioFieldSnapshot.options?.find(
        (option) => option.optionId === lowRiskOptionIdForField
      );

      return (
        lowRiskOptionFoundInSnapshot &&
        !lowRiskOptionFoundInSnapshot.wasSelected
      );
    }
  );

  return someLowRiskOptionInSnapshotNotSelected;
}

export const knownRadioFieldIds = [
  "hvorSannsynligTilbakeTilJobben",
  "tilbakeTilJobbenHvorSannsynligFlervalg",
  "arbeidsgiverHvordanErSamarbeidFlervalg",
  "arbeidsgiverFaarDuOppfolgingFlervalg",
  "naarTilbakeTilJobbenFlervalg",
] as const;

export const lowRiskOptionIdByRadioFieldId: Record<KnownRadioFieldId, string> =
  {
    hvorSannsynligTilbakeTilJobben: "1a",
    tilbakeTilJobbenHvorSannsynligFlervalg: "1a",
    arbeidsgiverHvordanErSamarbeidFlervalg: "2a",
    arbeidsgiverFaarDuOppfolgingFlervalg: "ja",
    naarTilbakeTilJobbenFlervalg: "3a",
  } as const;

type KnownRadioFieldId = (typeof knownRadioFieldIds)[number];

function isKnownRadioFieldId(fieldId: string): fieldId is KnownRadioFieldId {
  return fieldId in lowRiskOptionIdByRadioFieldId;
}
