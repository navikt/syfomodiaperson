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

  const someNotLowRiskOptionsSelected = lowRiskOptions.some((lowRiskOption) => {
    const matchingFieldSnapshot = radioFieldSnapshots.find(
      (field) => field.fieldId === lowRiskOption.fieldId
    );

    const lowRiskOptionInSnapshot = matchingFieldSnapshot?.options?.find(
      (option) => option.optionId === lowRiskOption.optionId
    );

    return (
      lowRiskOptionInSnapshot !== undefined &&
      !lowRiskOptionInSnapshot.wasSelected
    );
  });

  return someNotLowRiskOptionsSelected;
}

export const lowRiskOptions = [
  {
    fieldId: "hvorSannsynligTilbakeTilJobben",
    optionId: "1a",
  },
  {
    fieldId: "tilbakeTilJobbenHvorSannsynligFlervalg",
    optionId: "1a",
  },
  {
    fieldId: "arbeidsgiverHvordanErSamarbeidFlervalg",
    optionId: "2a",
  },
  {
    fieldId: "arbeidsgiverFaarDuOppfolgingFlervalg",
    optionId: "ja",
  },
  {
    fieldId: "naarTilbakeTilJobbenFlervalg",
    optionId: "3a",
  },
] as const;
