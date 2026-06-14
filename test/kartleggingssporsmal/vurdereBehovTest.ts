import { describe, expect, it } from "vitest";
import {
  hasRiskoForLangtidsfravar,
  lowRiskAnswers,
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

function createAnsweredQuestions(
  selectedOptionsByField: Record<string, string>
): KartleggingssporsmalSvarResponseDTO {
  return {
    uuid: "test-uuid",
    fnr: "12345678910",
    kandidatId: "kandidat-id",
    createdAt: new Date("2026-01-01"),
    formSnapshot: {
      formSemanticVersion: "1.0.0",
      fieldSnapshots: [
        createRadioGroupFieldSnapshot(
          "hvorSannsynligTilbakeTilJobben",
          selectedOptionsByField.hvorSannsynligTilbakeTilJobben,
          [lowRiskAnswers[0].optionId, "RISK_OPTION_1", "RISK_OPTION_2"]
        ),
        createRadioGroupFieldSnapshot(
          "arbeidsgiverHvordanErSamarbeidFlervalg",
          selectedOptionsByField.arbeidsgiverHvordanErSamarbeidFlervalg,
          [lowRiskAnswers[1].optionId, "RISK_OPTION_3"]
        ),
        createRadioGroupFieldSnapshot(
          "naarTilbakeTilJobbenFlervalg",
          selectedOptionsByField.naarTilbakeTilJobbenFlervalg,
          [lowRiskAnswers[2].optionId, "RISK_OPTION_4"]
        ),
      ],
    },
  };
}

describe("vurdereBehov", () => {
  it("returns false when all selected options are low-risk answers", () => {
    const answeredQuestions = createAnsweredQuestions({
      hvorSannsynligTilbakeTilJobben: lowRiskAnswers[0].optionId,
      arbeidsgiverHvordanErSamarbeidFlervalg: lowRiskAnswers[1].optionId,
      naarTilbakeTilJobbenFlervalg: lowRiskAnswers[2].optionId,
    });

    const hasRisk = hasRiskoForLangtidsfravar(answeredQuestions);

    expect(hasRisk).to.equal(false);
  });

  it("returns true when hvorSannsynligTilbakeTilJobben is RISK_OPTION_1", () => {
    const answeredQuestions = createAnsweredQuestions({
      hvorSannsynligTilbakeTilJobben: "RISK_OPTION_1",
      arbeidsgiverHvordanErSamarbeidFlervalg: lowRiskAnswers[1].optionId,
      naarTilbakeTilJobbenFlervalg: lowRiskAnswers[2].optionId,
    });

    const hasRisk = hasRiskoForLangtidsfravar(answeredQuestions);

    expect(hasRisk).to.equal(true);
  });

  it("returns true when hvorSannsynligTilbakeTilJobben is RISK_OPTION_2", () => {
    const answeredQuestions = createAnsweredQuestions({
      hvorSannsynligTilbakeTilJobben: "RISK_OPTION_2",
      arbeidsgiverHvordanErSamarbeidFlervalg: lowRiskAnswers[1].optionId,
      naarTilbakeTilJobbenFlervalg: lowRiskAnswers[2].optionId,
    });

    const hasRisk = hasRiskoForLangtidsfravar(answeredQuestions);

    expect(hasRisk).to.equal(true);
  });

  it("returns true when arbeidsgiverHvordanErSamarbeid differs from low-risk option", () => {
    const answeredQuestions = createAnsweredQuestions({
      hvorSannsynligTilbakeTilJobben: lowRiskAnswers[0].optionId,
      arbeidsgiverHvordanErSamarbeidFlervalg: "RISK_OPTION_3",
      naarTilbakeTilJobbenFlervalg: lowRiskAnswers[2].optionId,
    });

    const hasRisk = hasRiskoForLangtidsfravar(answeredQuestions);

    expect(hasRisk).to.equal(true);
  });

  it("returns true when naarTilbakeTilJobben differs from low-risk option", () => {
    const answeredQuestions = createAnsweredQuestions({
      hvorSannsynligTilbakeTilJobben: lowRiskAnswers[0].optionId,
      arbeidsgiverHvordanErSamarbeidFlervalg: lowRiskAnswers[1].optionId,
      naarTilbakeTilJobbenFlervalg: "RISK_OPTION_4",
    });

    const hasRisk = hasRiskoForLangtidsfravar(answeredQuestions);

    expect(hasRisk).to.equal(true);
  });

  it("returns true when all answers differ from low-risk options", () => {
    const answeredQuestions = createAnsweredQuestions({
      hvorSannsynligTilbakeTilJobben: "RISK_OPTION_1",
      arbeidsgiverHvordanErSamarbeidFlervalg: "RISK_OPTION_3",
      naarTilbakeTilJobbenFlervalg: "RISK_OPTION_4",
    });

    const hasRisk = hasRiskoForLangtidsfravar(answeredQuestions);

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

    const hasRisk = hasRiskoForLangtidsfravar(answeredQuestions);

    expect(hasRisk).to.equal(false);
  });
});
