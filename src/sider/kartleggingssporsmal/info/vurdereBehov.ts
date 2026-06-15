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

  const someLowRiskOptionNotSelected = radioFieldSnapshots.some(
    (radioFieldSnapshot) => {
      const predefinedLowRiskOptionIdForField = lowRiskOptionIdByField.get(
        radioFieldSnapshot.fieldId as RadioFieldId
      );
      if (!predefinedLowRiskOptionIdForField) return false;

      const lowRiskOptionFoundInSnapshot = radioFieldSnapshot.options?.find(
        (option) => option.optionId === predefinedLowRiskOptionIdForField
      );

      return (
        lowRiskOptionFoundInSnapshot &&
        !lowRiskOptionFoundInSnapshot.wasSelected
      );
    }
  );

  return someLowRiskOptionNotSelected;
}

type RadioFieldId =
  | "hvorSannsynligTilbakeTilJobben"
  | "tilbakeTilJobbenHvorSannsynligFlervalg"
  | "arbeidsgiverHvordanErSamarbeidFlervalg"
  | "arbeidsgiverFaarDuOppfolgingFlervalg"
  | "naarTilbakeTilJobbenFlervalg";

export const lowRiskOptionIdByField = new Map<RadioFieldId, string>([
  ["hvorSannsynligTilbakeTilJobben", "1a"],
  ["tilbakeTilJobbenHvorSannsynligFlervalg", "1a"],
  ["arbeidsgiverHvordanErSamarbeidFlervalg", "2a"],
  ["arbeidsgiverFaarDuOppfolgingFlervalg", "ja"],
  ["naarTilbakeTilJobbenFlervalg", "3a"],
]);
