import { describe, expect, it } from "vitest";
import {
  hasRisikoForLangtidsfravar,
  lowRiskOptionIdByRadioFieldId,
} from "@/sider/kartleggingssporsmal/info/vurdereBehov.ts";
import {
  KartleggingssporsmalFormSnapshotFieldType,
  KartleggingssporsmalRadioGroupFieldSnapshot,
} from "@/data/kartleggingssporsmal/kartleggingssporsmalSkjemasvarTypes";
import { KartleggingssporsmalSvarResponseDTO } from "@/data/kartleggingssporsmal/kartleggingssporsmalTypes";

function createRadioGroupFieldSnapshot(
  fieldId: string,
  selectedOptionId: string,
  optionIds: readonly string[]
): KartleggingssporsmalRadioGroupFieldSnapshot {
  return {
    fieldId,
    fieldType: KartleggingssporsmalFormSnapshotFieldType.RADIO_GROUP,
    label: fieldId,
    description: null,
    wasRequired: true,
    options: optionIds.map((optionId) => ({
      optionId,
      optionLabel: optionId,
      wasSelected: optionId === selectedOptionId,
    })),
  };
}

const RISK_OPTION_ID = "RISK_OPTION";

function createAnsweredQuestions(
  overrides: Partial<Record<string, string>> = {}
): KartleggingssporsmalSvarResponseDTO {
  return {
    uuid: "test-uuid",
    fnr: "12345678910",
    kandidatId: "kandidat-id",
    createdAt: new Date("2026-01-01"),
    formSnapshot: {
      formSemanticVersion: "1.0.0",
      fieldSnapshots: Object.entries(lowRiskOptionIdByRadioFieldId).map(
        ([fieldId, optionId]) =>
          createRadioGroupFieldSnapshot(
            fieldId,
            overrides[fieldId] ?? optionId,
            [optionId, RISK_OPTION_ID]
          )
      ),
    },
  };
}

describe("vurdereBehov", () => {
  it("returns false when all selected options are low-risk answers", () => {
    const answeredQuestions = createAnsweredQuestions();

    const hasRisk = hasRisikoForLangtidsfravar(answeredQuestions);

    expect(hasRisk).to.equal(false);
  });

  it.each(Object.keys(lowRiskOptionIdByRadioFieldId))(
    "returns true when %s is answered with a risk option",
    (fieldId) => {
      const answeredQuestions = createAnsweredQuestions({
        [fieldId]: RISK_OPTION_ID,
      });

      const hasRisk = hasRisikoForLangtidsfravar(answeredQuestions);

      expect(hasRisk).to.equal(true);
    }
  );

  it("returns true when all answers differ from low-risk options", () => {
    const allRiskOptions = Object.fromEntries(
      Object.keys(lowRiskOptionIdByRadioFieldId).map((fieldId) => [
        fieldId,
        RISK_OPTION_ID,
      ])
    );
    const answeredQuestions = createAnsweredQuestions(allRiskOptions);

    const hasRisk = hasRisikoForLangtidsfravar(answeredQuestions);

    expect(hasRisk).to.equal(true);
  });

  it("returns false when there are no radio-group answers", () => {
    const answeredQuestions: KartleggingssporsmalSvarResponseDTO = {
      uuid: "test-uuid",
      fnr: "12345678910",
      kandidatId: "kandidat-id",
      createdAt: new Date("2026-01-01"),
      formSnapshot: {
        formSemanticVersion: "1.0.0",
        fieldSnapshots: [
          {
            fieldId: "tilleggsinformasjon",
            fieldType: KartleggingssporsmalFormSnapshotFieldType.TEXT,
            label: "Tilleggsinformasjon",
            description: null,
            value: "Tekst",
            wasRequired: false,
          },
        ],
      },
    };

    const hasRisk = hasRisikoForLangtidsfravar(answeredQuestions);

    expect(hasRisk).to.equal(false);
  });
});
