import { KartleggingssporsmalSvarResponseDTO } from "@/data/kartleggingssporsmal/kartleggingssporsmalTypes.ts";
import { KartleggingssporsmalFormSnapshotFieldType } from "@/data/kartleggingssporsmal/kartleggingssporsmalSkjemasvarTypes.ts";

export function hasRiskoForLangtidsfravar(
  answeredQuestions: KartleggingssporsmalSvarResponseDTO
) {
  if (answeredQuestions.formSnapshot.fieldSnapshots) {
    const fieldSnapshots = answeredQuestions.formSnapshot.fieldSnapshots.filter(
      (field) =>
        field?.fieldType ===
        KartleggingssporsmalFormSnapshotFieldType.RADIO_GROUP
    );
    return lowRiskAnswers.some((lowRiskAnswer) => {
      const fieldSnapshot = fieldSnapshots.find(
        (field) => field.fieldId === lowRiskAnswer.fieldId
      );
      if (!fieldSnapshot) return false;

      const lowRiskOption = fieldSnapshot.options?.find(
        (option) => option.optionId === lowRiskAnswer.optionId
      );
      return lowRiskOption !== undefined && !lowRiskOption.wasSelected;
    });
  }
}

export const lowRiskAnswers = [
  {
    fieldId: "hvorSannsynligTilbakeTilJobben",
    optionId: "1a",
  },
  {
    fieldId: "arbeidsgiverHvordanErSamarbeidFlervalg",
    optionId: "2a",
  },
  {
    fieldId: "naarTilbakeTilJobbenFlervalg",
    optionId: "3a",
  },
] as const;
