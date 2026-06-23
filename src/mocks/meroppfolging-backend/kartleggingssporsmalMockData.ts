import { ARBEIDSTAKER_DEFAULT } from "../common/mockConstants";
import { KartleggingssporsmalSvarResponseDTO } from "@/data/kartleggingssporsmal/kartleggingssporsmalTypes";
import { generateUUID } from "@/utils/utils";
import {
  KartleggingssporsmalFormSnapshotFieldOption,
  KartleggingssporsmalFormSnapshotFieldType,
  KartleggingssporsmalRadioGroupFieldSnapshot,
  KartleggingssporsmalTextFieldSnapshot,
} from "@/data/kartleggingssporsmal/kartleggingssporsmalSkjemasvarTypes";
import { daysFromToday } from "@/utils/datoUtils.ts";

function createRadioOption(
  id: string,
  label: string,
  isSelected = false,
): KartleggingssporsmalFormSnapshotFieldOption {
  return {
    optionId: id,
    optionLabel: label,
    wasSelected: isSelected,
  };
}

/** Returns a default RADIO_GROUP field snapshot, useful as a base for spread overrides in tests. */
export function defaultRadioGroupSporsmal(
  fieldId: string,
): KartleggingssporsmalRadioGroupFieldSnapshot {
  return {
    fieldId: fieldId,
    fieldType: KartleggingssporsmalFormSnapshotFieldType.RADIO_GROUP,
    description: null,
    label: "Label 1",
    options: [
      createRadioOption("1a", "Ja", true),
      createRadioOption("1b", "Nei"),
    ],
    wasRequired: true,
  };
}

// --- FLERVALG_V1 field snapshots ---

const tilbakeTilJobbenHvorSannsynligHighRisk: KartleggingssporsmalRadioGroupFieldSnapshot =
  {
    ...defaultRadioGroupSporsmal("tilbakeTilJobbenHvorSannsynligFlervalg"),
    label:
      "Hvor sannsynlig er det at du kommer tilbake i jobben du ble sykmeldt fra?",
    options: [
      createRadioOption("1a", "Jeg tror det er veldig sannsynlig"),
      createRadioOption("1b", "Jeg tror det er lite sannsynlig"),
      createRadioOption("1c", "Jeg er usikker", true),
    ],
  };

const tilbakeTilJobbenHvorSannsynligLowRisk: KartleggingssporsmalRadioGroupFieldSnapshot =
  {
    ...defaultRadioGroupSporsmal("tilbakeTilJobbenHvorSannsynligFlervalg"),
    label:
      "Hvor sannsynlig er det at du kommer tilbake i jobben du ble sykmeldt fra?",
    options: [
      createRadioOption("1a", "Jeg tror det er veldig sannsynlig", true),
      createRadioOption("1b", "Jeg tror det er lite sannsynlig"),
      createRadioOption("1c", "Jeg er usikker"),
    ],
  };

const arbeidsgiverHvordanErSamarbeidHighRisk: KartleggingssporsmalRadioGroupFieldSnapshot =
  {
    ...defaultRadioGroupSporsmal("arbeidsgiverHvordanErSamarbeidFlervalg"),
    label:
      "Hvordan vil du beskrive samarbeidet og relasjonen mellom deg og arbeidsgiveren din?",
    options: [
      createRadioOption("2a", "Jeg opplever samarbeidet og relasjonen som god"),
      createRadioOption(
        "2b",
        "Jeg opplever samarbeidet og relasjonen som dårlig",
        true,
      ),
    ],
  };

const arbeidsgiverHvordanErSamarbeidLowRisk: KartleggingssporsmalRadioGroupFieldSnapshot =
  {
    ...defaultRadioGroupSporsmal("arbeidsgiverHvordanErSamarbeidFlervalg"),
    label:
      "Hvordan vil du beskrive samarbeidet og relasjonen mellom deg og arbeidsgiveren din?",
    options: [
      createRadioOption(
        "2a",
        "Jeg opplever samarbeidet og relasjonen som god",
        true,
      ),
      createRadioOption(
        "2b",
        "Jeg opplever samarbeidet og relasjonen som dårlig",
      ),
    ],
  };

const naarTilbakeTilJobben: KartleggingssporsmalRadioGroupFieldSnapshot = {
  ...defaultRadioGroupSporsmal("naarTilbakeTilJobbenFlervalg"),
  label: "Hvor lenge tror du at du kommer til å være sykmeldt?",
  options: [
    createRadioOption("3a", "Mindre enn seks måneder", true),
    createRadioOption("3b", "Mer enn seks måneder"),
  ],
};

/** FLERVALG_V1 answered with high-risk selections. */
export const kartleggingssporsmalFlervalgV1Answered: KartleggingssporsmalSvarResponseDTO =
  {
    uuid: generateUUID(),
    fnr: ARBEIDSTAKER_DEFAULT.personIdent,
    kandidatId: generateUUID(),
    createdAt: daysFromToday(-2),
    formSnapshot: {
      formSemanticVersion: "1.0.0",
      formIdentifier: "skjemavariant",
      fieldSnapshots: [
        tilbakeTilJobbenHvorSannsynligHighRisk,
        arbeidsgiverHvordanErSamarbeidHighRisk,
        naarTilbakeTilJobben,
      ],
    },
  };

/** FLERVALG_V1 answered with low-risk selections on all fields. */
export const kartleggingssporsmalFlervalgV1LowRiskAnswered: KartleggingssporsmalSvarResponseDTO =
  {
    uuid: generateUUID(),
    fnr: ARBEIDSTAKER_DEFAULT.personIdent,
    kandidatId: generateUUID(),
    createdAt: daysFromToday(-2),
    formSnapshot: {
      formSemanticVersion: "1.0.0",
      formIdentifier: "skjemavariant",
      fieldSnapshots: [
        tilbakeTilJobbenHvorSannsynligLowRisk,
        arbeidsgiverHvordanErSamarbeidLowRisk,
        naarTilbakeTilJobben,
      ],
    },
  };

// --- FLERVALG_FRITEKST_V3 field snapshots ---

const mulighetForTilbakeTilJobbenHighRisk: KartleggingssporsmalRadioGroupFieldSnapshot =
  {
    ...defaultRadioGroupSporsmal("mulighetForTilbakeTilJobbenFlervalg"),
    label:
      "Hvordan ser du for deg muligheten for å komme tilbake til din nåværende jobb og stilling?",
    description:
      "Tenk over om du tror du kan komme helt eller delvis tilbake til din nåværende jobb og stilling, eller om du ser det som utfordrende.",
    options: [
      createRadioOption(
        "kommer_tilbake",
        "Jeg har tro på at jeg kommer tilbake til samme jobb og stilling",
      ),
      createRadioOption(
        "utfordrende",
        "Jeg ser på det som utfordrende å komme tilbake til samme jobb og stilling",
        true,
      ),
    ],
  };

const mulighetForTilbakeTilJobbenLowRisk: KartleggingssporsmalRadioGroupFieldSnapshot =
  {
    ...defaultRadioGroupSporsmal("mulighetForTilbakeTilJobbenFlervalg"),
    label:
      "Hvordan ser du for deg muligheten for å komme tilbake til din nåværende jobb og stilling?",
    description:
      "Tenk over om du tror du kan komme helt eller delvis tilbake til din nåværende jobb og stilling, eller om du ser det som utfordrende.",
    options: [
      createRadioOption(
        "kommer_tilbake",
        "Jeg har tro på at jeg kommer tilbake til samme jobb og stilling",
        true,
      ),
      createRadioOption(
        "utfordrende",
        "Jeg ser på det som utfordrende å komme tilbake til samme jobb og stilling",
      ),
    ],
  };

const mulighetForTilbakeTilJobbenUtfordrendeBegrunnelse: KartleggingssporsmalTextFieldSnapshot =
  {
    fieldId: "mulighetForTilbakeTilJobbenUtfordrendeBegrunnelse",
    fieldType: KartleggingssporsmalFormSnapshotFieldType.TEXT,
    description:
      "Ikke skriv detaljerte opplysninger om helse, personlige opplysninger eller opplysninger om andre enn deg selv.",
    label:
      "Beskriv hva som er utfordrende, og hva du tror kan hjelpe deg videre",
    value:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. " +
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    wasRequired: false,
  };

const arbeidsgiverFaarDuOppfolgingHighRisk: KartleggingssporsmalRadioGroupFieldSnapshot =
  {
    ...defaultRadioGroupSporsmal("arbeidsgiverFaarDuOppfolgingFlervalg"),
    label: "Får du oppfølging av arbeidsgiveren din nå når du er sykmeldt?",
    description:
      "Arbeidsgiveren din har hovedansvaret for å gjøre tilpasninger og følge deg opp på arbeidsplassen.",
    options: [
      createRadioOption(
        "ja",
        "Ja, jeg får oppfølging, og har snakket med arbeidsgiver om dette.",
      ),
      createRadioOption(
        "nei",
        "Nei, jeg opplever manglende oppfølging og at tilpasninger er vanskelig.",
        true,
      ),
    ],
  };

const arbeidsgiverFaarDuOppfolgingLowRisk: KartleggingssporsmalRadioGroupFieldSnapshot =
  {
    ...defaultRadioGroupSporsmal("arbeidsgiverFaarDuOppfolgingFlervalg"),
    label: "Får du oppfølging av arbeidsgiveren din nå når du er sykmeldt?",
    description:
      "Arbeidsgiveren din har hovedansvaret for å gjøre tilpasninger og følge deg opp på arbeidsplassen.",
    options: [
      createRadioOption(
        "ja",
        "Ja, jeg får oppfølging, og har snakket med arbeidsgiver om dette.",
        true,
      ),
      createRadioOption(
        "nei",
        "Nei, jeg opplever manglende oppfølging og at tilpasninger er vanskelig.",
      ),
    ],
  };

const arbeidsgiverFaarDuOppfolgingNeiBegrunnelse: KartleggingssporsmalTextFieldSnapshot =
  {
    fieldId: "arbeidsgiverFaarDuOppfolgingNeiBegrunnelse",
    fieldType: KartleggingssporsmalFormSnapshotFieldType.TEXT,
    description:
      "Skriv kort om hva du har behov for og hva som er vanskelig. Svaret ditt er kun synlig for Nav, og blir ikke delt med din arbeidsgiver.",
    label:
      "Hva savner du i samarbeidet med arbeidsgiver for at du skal få bedre oppfølging?",
    value: "   ",
    wasRequired: false,
  };

/** FLERVALG_FRITEKST_V3 answered with high-risk selections and conditional fritekst fields included. */
export const kartleggingssporsmalFlervalgFritekstV3Answered: KartleggingssporsmalSvarResponseDTO =
  {
    uuid: generateUUID(),
    fnr: ARBEIDSTAKER_DEFAULT.personIdent,
    kandidatId: generateUUID(),
    createdAt: daysFromToday(-2),
    formSnapshot: {
      formSemanticVersion: "1.0.0",
      formIdentifier: "skjemavariant",
      fieldSnapshots: [
        mulighetForTilbakeTilJobbenHighRisk,
        mulighetForTilbakeTilJobbenUtfordrendeBegrunnelse,
        arbeidsgiverFaarDuOppfolgingHighRisk,
        arbeidsgiverFaarDuOppfolgingNeiBegrunnelse,
        naarTilbakeTilJobben,
      ],
    },
  };

/** FLERVALG_FRITEKST_V3 answered with low-risk selections. */
export const kartleggingssporsmalFlervalgFritekstV3LowRiskAnswered: KartleggingssporsmalSvarResponseDTO =
  {
    uuid: generateUUID(),
    fnr: ARBEIDSTAKER_DEFAULT.personIdent,
    kandidatId: generateUUID(),
    createdAt: daysFromToday(-2),
    formSnapshot: {
      formSemanticVersion: "1.0.0",
      formIdentifier: "skjemavariant",
      fieldSnapshots: [
        mulighetForTilbakeTilJobbenLowRisk,
        arbeidsgiverFaarDuOppfolgingLowRisk,
        naarTilbakeTilJobben,
      ],
    },
  };
