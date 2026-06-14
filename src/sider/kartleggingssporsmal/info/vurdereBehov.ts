import { KartleggingssporsmalSvarResponseDTO } from "@/data/kartleggingssporsmal/kartleggingssporsmalTypes.ts";
import { KartleggingssporsmalFormSnapshotFieldType } from "@/data/kartleggingssporsmal/kartleggingssporsmalSkjemasvarTypes.ts";

export function hasRiskoForLangtidsfravar(
  answeredQuestions: KartleggingssporsmalSvarResponseDTO
) {
  if (answeredQuestions.formSnapshot.fieldSnapshots) {
    const optionAnswers = answeredQuestions.formSnapshot.fieldSnapshots.filter(
      (field) =>
        field?.fieldType ===
        KartleggingssporsmalFormSnapshotFieldType.RADIO_GROUP
    );
    return lowRiskAnswers.some((answer) => {
      const fieldSnapshot = optionAnswers.find(
        (field) => field.fieldId === answer.field
      );
      if (!fieldSnapshot) return false;

      const option = fieldSnapshot.options?.find(
        (option) => option.optionId === answer.optionId
      );
      return option !== undefined && !option.wasSelected;
    });
  }
}

export const lowRiskAnswers = [
  {
    field: "hvorSannsynligTilbakeTilJobben",
    optionId: "1a",
  },
  {
    field: "tilbakeTilJobbenHvorSannsynligFlervalg",
    optionId: "1a",
  },
  {
    field: "arbeidsgiverHvordanErSamarbeidFlervalg",
    optionId: "2a",
  },
  {
    field: "arbeidsgiverFaarDuOppfolgingFlervalg",
    optionId: "ja",
  },
  {
    field: "naarTilbakeTilJobbenFlervalg",
    optionId: "3a",
  },
] as const;
