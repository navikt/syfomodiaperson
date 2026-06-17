import { describe, expect, it } from "vitest";
import {
  hasRisikoForLangtidsfravar,
  knownRadioFieldIds,
  lowRiskOptionIdByRadioFieldId,
} from "@/sider/kartleggingssporsmal/info/vurdereBehov.ts";
import {
  KartleggingssporsmalFormSnapshotFieldType,
  KartleggingssporsmalRadioGroupFieldSnapshot,
} from "@/data/kartleggingssporsmal/kartleggingssporsmalSkjemasvarTypes";
import { KartleggingssporsmalSvarResponseDTO } from "@/data/kartleggingssporsmal/kartleggingssporsmalTypes";

function createRadioGroupFieldSnapshot({
  fieldId,
  selectedOptionId,
  optionIds,
}: {
  fieldId: string;
  selectedOptionId: string;
  optionIds: readonly string[];
}): KartleggingssporsmalRadioGroupFieldSnapshot {
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
const ALL_FIELDS = "ALL_FIELDS" as const;

function createAnsweredQuestions({
  fieldsWithRiskOptionSelected,
}: {
  fieldsWithRiskOptionSelected: string[] | typeof ALL_FIELDS;
}): KartleggingssporsmalSvarResponseDTO {
  return {
    uuid: "test-uuid",
    fnr: "12345678910",
    kandidatId: "kandidat-id",
    createdAt: new Date("2026-01-01"),
    formSnapshot: {
      formSemanticVersion: "1.0.0",
      formIdentifier: "skjemavariant",
      fieldSnapshots: Object.entries(lowRiskOptionIdByRadioFieldId).map(
        ([fieldId, lowRiskOptionId]) => {
          const selectRiskOption =
            fieldsWithRiskOptionSelected === ALL_FIELDS ||
            fieldsWithRiskOptionSelected.includes(fieldId);

          return createRadioGroupFieldSnapshot({
            fieldId,
            selectedOptionId: selectRiskOption
              ? RISK_OPTION_ID
              : lowRiskOptionId,
            optionIds: [lowRiskOptionId, RISK_OPTION_ID],
          });
        }
      ),
    },
  };
}

describe("vurdereBehov", () => {
  it("returns false when all selected options are low-risk answers", () => {
    const answeredQuestions = createAnsweredQuestions({
      fieldsWithRiskOptionSelected: [],
    });

    const hasRisk = hasRisikoForLangtidsfravar(answeredQuestions);

    expect(hasRisk).to.equal(false);
  });

  it.each(knownRadioFieldIds)(
    "returns true when %s is answered with a risk option",
    (fieldId) => {
      const answeredQuestions = createAnsweredQuestions({
        fieldsWithRiskOptionSelected: [fieldId],
      });

      const hasRisk = hasRisikoForLangtidsfravar(answeredQuestions);

      expect(hasRisk).to.equal(true);
    }
  );

  it("returns true when all answers differ from low-risk options", () => {
    const answeredQuestions = createAnsweredQuestions({
      fieldsWithRiskOptionSelected: ALL_FIELDS,
    });

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
        formIdentifier: "skjemavariant",
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
