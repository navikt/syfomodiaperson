import {
  MEROPPFOLGING_BACKEND_V1_ROOT,
  MEROPPFOLGING_BACKEND_V2_ROOT,
} from "@/apiConstants";
import { SenOppfolgingFormResponseDTOV2 } from "@/data/senoppfolging/senOppfolgingTypes";
import { ARBEIDSTAKER_DEFAULT } from "../common/mockConstants";
import { http, HttpResponse } from "msw";
import { KartleggingssporsmalSvarResponseDTO } from "@/data/kartleggingssporsmal/kartleggingssporsmalTypes";
import { FormSnapshotFieldOption } from "@/data/skjemasvar/types/SkjemasvarTypes";
import { daysFromToday } from "../../../test/testUtils";
import { generateUUID } from "@/utils/utils";
import {
  KartleggingssporsmalFormSnapshotFieldType,
  KartleggingssporsmalRadioGroupFieldSnapshot,
  KartleggingssporsmalTextFieldSnapshot,
} from "@/data/kartleggingssporsmal/kartleggingssporsmalSkjemasvarTypes";

export const mockMerOppfolging = [
  http.get(
    `${MEROPPFOLGING_BACKEND_V2_ROOT}/senoppfolging/formresponse`,
    () => {
      return HttpResponse.json(merOppfolgingMock);
    }
  ),
  http.get(
    `${MEROPPFOLGING_BACKEND_V1_ROOT}/kartleggingssporsmal/kandidat/:kandidatUUID/svar`,
    () => {
      return HttpResponse.json(kartleggingssporsmalAnswered);
    }
  ),
];

export const merOppfolgingMock: SenOppfolgingFormResponseDTOV2 = {
  uuid: "123",
  personIdent: ARBEIDSTAKER_DEFAULT.personIdent,
  createdAt: new Date(),
  formType: "V2",
  questionResponses: [
    {
      questionType: "FREMTIDIG_SITUASJON",
      questionText:
        "I hvilken situasjon ser du for deg at du står når sykepengene tar slutt?",
      answerType: "TILBAKE_HOS_ARBEIDSGIVER",
      answerText: "Jeg er frisk og tilbake hos arbeidsgiver",
    },
    {
      questionType: "BEHOV_FOR_OPPFOLGING",
      questionText: "Har du behov for hjelp fra oss i Nav?",
      answerType: "JA",
      answerText: "Ja, jeg vil snakke med en veileder i Nav",
    },
  ],
};

const createRadioOption = (
  id: string,
  label: string,
  isSelected = false
): FormSnapshotFieldOption => {
  return {
    optionId: id,
    optionLabel: label,
    wasSelected: isSelected,
  };
};

export const defaultRadioGroupSporsmal = (
  fieldId: string
): KartleggingssporsmalRadioGroupFieldSnapshot => {
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
};

const kartleggingssporsmal: KartleggingssporsmalRadioGroupFieldSnapshot[] = [
  {
    ...defaultRadioGroupSporsmal("hvorSannsynligTilbakeTilJobben"),
    label:
      "Hvor sannsynlig er det at du kommer tilbake i jobben du ble sykmeldt fra?",
    options: [
      createRadioOption("1a", "Jeg tror det er veldig sannsynlig"),
      createRadioOption("1b", "Jeg tror det er lite sannsynlig"),
      createRadioOption("1c", "Jeg er usikker", true),
    ],
  },
  {
    ...defaultRadioGroupSporsmal("arbeidsgiverHvordanErSamarbeidFlervalg"),
    label:
      "Hvordan vil du beskrive samarbeidet og relasjonen mellom deg og arbeidsgiveren din?",
    options: [
      createRadioOption("2a", "Jeg opplever samarbeidet og relasjonen som god"),
      createRadioOption(
        "2b",
        "Jeg opplever samarbeidet og relasjonen som dårlig",
        true
      ),
    ],
  },
  {
    ...defaultRadioGroupSporsmal("naarTilbakeTilJobbenFlervalg"),
    label: "Hvor lenge tror du at du kommer til å være sykmeldt?",
    options: [
      createRadioOption("3a", "Mindre enn seks måneder", true),
      createRadioOption("3b", "Mer enn seks måneder"),
    ],
  },
];

const hvorforUsikkerTextSporsmal: KartleggingssporsmalTextFieldSnapshot = {
  fieldId: "tilbakeTilJobbenLiteSannsynligBegrunnelse",
  fieldType: KartleggingssporsmalFormSnapshotFieldType.TEXT,
  description:
    "Skriv kortfattet hvorfor du er usikker på om du kommer tilbake i jobben du ble sykmeldt fra",
  label: "Hva gjør deg usikker?",
  value:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. " +
    "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  wasRequired: false,
};

const samarbeidTextSporsmal: KartleggingssporsmalTextFieldSnapshot = {
  fieldId: "arbeidsgiverSamarbeidDarligBegrunnelse",
  fieldType: KartleggingssporsmalFormSnapshotFieldType.TEXT,
  description: null,
  label: "Hva gjør samarbeidet og relasjonen dårlig?",
  value: "   ",
  wasRequired: false,
};

export const kartleggingssporsmalAnswered: KartleggingssporsmalSvarResponseDTO =
  {
    uuid: generateUUID(),
    fnr: ARBEIDSTAKER_DEFAULT.personIdent,
    kandidatId: generateUUID(),
    createdAt: daysFromToday(-2),
    formSnapshot: {
      formSemanticVersion: "1.0.0",
      fieldSnapshots: [
        kartleggingssporsmal[0],
        hvorforUsikkerTextSporsmal,
        ...kartleggingssporsmal.slice(1, 2),
        samarbeidTextSporsmal,
        ...kartleggingssporsmal.slice(2),
      ],
    },
  };

export const kartleggingssporsmalLowRiskAnswered: KartleggingssporsmalSvarResponseDTO =
  {
    uuid: generateUUID(),
    fnr: ARBEIDSTAKER_DEFAULT.personIdent,
    kandidatId: generateUUID(),
    createdAt: daysFromToday(-2),
    formSnapshot: {
      formSemanticVersion: "1.0.0",
      fieldSnapshots: [
        {
          ...defaultRadioGroupSporsmal("hvorSannsynligTilbakeTilJobben"),
          label:
            "Hvor sannsynlig er det at du kommer tilbake i jobben du ble sykmeldt fra?",
          options: [
            createRadioOption("1a", "Jeg tror det er veldig sannsynlig", true),
            createRadioOption("1b", "Jeg tror det er lite sannsynlig"),
            createRadioOption("1c", "Jeg er usikker"),
          ],
        },
        {
          ...defaultRadioGroupSporsmal(
            "arbeidsgiverHvordanErSamarbeidFlervalg"
          ),
          label:
            "Hvordan vil du beskrive samarbeidet og relasjonen mellom deg og arbeidsgiveren din?",
          options: [
            createRadioOption(
              "2a",
              "Jeg opplever samarbeidet og relasjonen som god",
              true
            ),
            createRadioOption(
              "2b",
              "Jeg opplever samarbeidet og relasjonen som dårlig"
            ),
          ],
        },
        {
          ...defaultRadioGroupSporsmal("naarTilbakeTilJobbenFlervalg"),
          label: "Hvor lenge tror du at du kommer til å være sykmeldt?",
          options: [
            createRadioOption("3a", "Mindre enn seks måneder", true),
            createRadioOption("3b", "Mer enn seks måneder"),
          ],
        },
      ],
    },
  };
