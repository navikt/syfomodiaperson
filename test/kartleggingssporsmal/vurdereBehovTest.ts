import { describe, expect, it } from "vitest";
import { hasRiskoForLangtidsfravar } from "@/sider/kartleggingssporsmal/info/vurdereBehov.ts";
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

function createAnsweredQuestionsV1(
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
          ["1a", "1b", "1c"]
        ),
        createRadioGroupFieldSnapshot(
          "arbeidsgiverHvordanErSamarbeidFlervalg",
          selectedOptionsByField.arbeidsgiverHvordanErSamarbeidFlervalg,
          ["2a", "2b"]
        ),
        createRadioGroupFieldSnapshot(
          "naarTilbakeTilJobbenFlervalg",
          selectedOptionsByField.naarTilbakeTilJobbenFlervalg,
          ["3a", "3b"]
        ),
      ],
    },
  };
}

function createAnsweredQuestionsV2(
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
          "tilbakeTilJobbenHvorSannsynligFlervalg",
          selectedOptionsByField.tilbakeTilJobbenHvorSannsynligFlervalg,
          ["1a", "1b", "1c"]
        ),
        createRadioGroupFieldSnapshot(
          "arbeidsgiverFaarDuOppfolgingFlervalg",
          selectedOptionsByField.arbeidsgiverFaarDuOppfolgingFlervalg,
          ["ja", "nei"]
        ),
        createRadioGroupFieldSnapshot(
          "naarTilbakeTilJobbenFlervalg",
          selectedOptionsByField.naarTilbakeTilJobbenFlervalg,
          ["3a", "3b"]
        ),
      ],
    },
  };
}

describe("vurdereBehov", () => {
  describe("FLERVALG_V1", () => {
    it("returns false when all selected options are low-risk answers", () => {
      const answeredQuestions = createAnsweredQuestionsV1({
        hvorSannsynligTilbakeTilJobben: "1a",
        arbeidsgiverHvordanErSamarbeidFlervalg: "2a",
        naarTilbakeTilJobbenFlervalg: "3a",
      });

      const hasRisk = hasRiskoForLangtidsfravar(answeredQuestions);

      expect(hasRisk).to.equal(false);
    });

    it("returns true when hvorSannsynligTilbakeTilJobben is 1b", () => {
      const answeredQuestions = createAnsweredQuestionsV1({
        hvorSannsynligTilbakeTilJobben: "1b",
        arbeidsgiverHvordanErSamarbeidFlervalg: "2a",
        naarTilbakeTilJobbenFlervalg: "3a",
      });

      const hasRisk = hasRiskoForLangtidsfravar(answeredQuestions);

      expect(hasRisk).to.equal(true);
    });

    it("returns true when hvorSannsynligTilbakeTilJobben is 1c", () => {
      const answeredQuestions = createAnsweredQuestionsV1({
        hvorSannsynligTilbakeTilJobben: "1c",
        arbeidsgiverHvordanErSamarbeidFlervalg: "2a",
        naarTilbakeTilJobbenFlervalg: "3a",
      });

      const hasRisk = hasRiskoForLangtidsfravar(answeredQuestions);

      expect(hasRisk).to.equal(true);
    });

    it("returns true when arbeidsgiverHvordanErSamarbeid differs from low-risk option", () => {
      const answeredQuestions = createAnsweredQuestionsV1({
        hvorSannsynligTilbakeTilJobben: "1a",
        arbeidsgiverHvordanErSamarbeidFlervalg: "2b",
        naarTilbakeTilJobbenFlervalg: "3a",
      });

      const hasRisk = hasRiskoForLangtidsfravar(answeredQuestions);

      expect(hasRisk).to.equal(true);
    });

    it("returns true when naarTilbakeTilJobben differs from low-risk option", () => {
      const answeredQuestions = createAnsweredQuestionsV1({
        hvorSannsynligTilbakeTilJobben: "1a",
        arbeidsgiverHvordanErSamarbeidFlervalg: "2a",
        naarTilbakeTilJobbenFlervalg: "3b",
      });

      const hasRisk = hasRiskoForLangtidsfravar(answeredQuestions);

      expect(hasRisk).to.equal(true);
    });

    it("returns true when all answers differ from low-risk options", () => {
      const answeredQuestions = createAnsweredQuestionsV1({
        hvorSannsynligTilbakeTilJobben: "1b",
        arbeidsgiverHvordanErSamarbeidFlervalg: "2b",
        naarTilbakeTilJobbenFlervalg: "3b",
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

  describe("FLERVALG_FRITEKST_V2", () => {
    it("returns false when all selected options are low-risk answers", () => {
      const answeredQuestions = createAnsweredQuestionsV2({
        tilbakeTilJobbenHvorSannsynligFlervalg: "1a",
        arbeidsgiverFaarDuOppfolgingFlervalg: "ja",
        naarTilbakeTilJobbenFlervalg: "3a",
      });

      const hasRisk = hasRiskoForLangtidsfravar(answeredQuestions);

      expect(hasRisk).to.equal(false);
    });

    it("returns true when tilbakeTilJobbenHvorSannsynlig is 1b", () => {
      const answeredQuestions = createAnsweredQuestionsV2({
        tilbakeTilJobbenHvorSannsynligFlervalg: "1b",
        arbeidsgiverFaarDuOppfolgingFlervalg: "ja",
        naarTilbakeTilJobbenFlervalg: "3a",
      });

      const hasRisk = hasRiskoForLangtidsfravar(answeredQuestions);

      expect(hasRisk).to.equal(true);
    });

    it("returns true when tilbakeTilJobbenHvorSannsynlig is 1c", () => {
      const answeredQuestions = createAnsweredQuestionsV2({
        tilbakeTilJobbenHvorSannsynligFlervalg: "1c",
        arbeidsgiverFaarDuOppfolgingFlervalg: "ja",
        naarTilbakeTilJobbenFlervalg: "3a",
      });

      const hasRisk = hasRiskoForLangtidsfravar(answeredQuestions);

      expect(hasRisk).to.equal(true);
    });

    it("returns true when arbeidsgiverFaarDuOppfolging is nei", () => {
      const answeredQuestions = createAnsweredQuestionsV2({
        tilbakeTilJobbenHvorSannsynligFlervalg: "1a",
        arbeidsgiverFaarDuOppfolgingFlervalg: "nei",
        naarTilbakeTilJobbenFlervalg: "3a",
      });

      const hasRisk = hasRiskoForLangtidsfravar(answeredQuestions);

      expect(hasRisk).to.equal(true);
    });

    it("returns true when naarTilbakeTilJobben differs from low-risk option", () => {
      const answeredQuestions = createAnsweredQuestionsV2({
        tilbakeTilJobbenHvorSannsynligFlervalg: "1a",
        arbeidsgiverFaarDuOppfolgingFlervalg: "ja",
        naarTilbakeTilJobbenFlervalg: "3b",
      });

      const hasRisk = hasRiskoForLangtidsfravar(answeredQuestions);

      expect(hasRisk).to.equal(true);
    });

    it("returns true when all answers differ from low-risk options", () => {
      const answeredQuestions = createAnsweredQuestionsV2({
        tilbakeTilJobbenHvorSannsynligFlervalg: "1b",
        arbeidsgiverFaarDuOppfolgingFlervalg: "nei",
        naarTilbakeTilJobbenFlervalg: "3b",
      });

      const hasRisk = hasRiskoForLangtidsfravar(answeredQuestions);

      expect(hasRisk).to.equal(true);
    });
  });
});
