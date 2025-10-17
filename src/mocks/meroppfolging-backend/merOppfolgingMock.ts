import { MEROPPFOLGING_BACKEND_ROOT } from "@/apiConstants";
import { SenOppfolgingFormResponseDTOV2 } from "@/data/senoppfolging/senOppfolgingTypes";
import { ARBEIDSTAKER_DEFAULT } from "../common/mockConstants";
import { http, HttpResponse } from "msw";
import { KartleggingssporsmalSvarStatusResponseDTO } from "@/data/kartleggingssporsmal/kartleggingssporsmalTypes";
import {
  FormIdentifier,
  FormSnapshotFieldOption,
  FormSnapshotFieldType,
  RadioGroupFieldSnapshot,
} from "@/data/skjemasvar/types/SkjemasvarTypes";
import { daysFromToday } from "../../../test/testUtils";

export const mockMerOppfolging = [
  http.get(`${MEROPPFOLGING_BACKEND_ROOT}/senoppfolging/formresponse`, () => {
    return HttpResponse.json(merOppfolgingMock);
  }),
  http.get(`${MEROPPFOLGING_BACKEND_ROOT}/kartleggingssporsmal/latest`, () => {
    return HttpResponse.json(kartleggingssporsmalAnswered);
  }),
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

export const defaultRadioGroupSporsmal = (
  value: boolean
): RadioGroupFieldSnapshot => ({
  fieldId: "hvorSannsynligTilbakeTilJobben",
  fieldType: FormSnapshotFieldType.RADIO_GROUP,
  description: null,
  label: "Label 1",
  selectedOptionId: value ? "Ja" : "Nei",
  selectedOptionLabel: value ? "Ja" : "Nei",
  options: [createRadioOption("Ja", true), createRadioOption("Nei")],
  wasRequired: true,
});

const createRadioOption = (
  label: string,
  isSelected = false
): FormSnapshotFieldOption => {
  return {
    optionId: label,
    optionLabel: label,
    wasSelected: isSelected,
  };
};

const kartleggingssporsmal: RadioGroupFieldSnapshot[] = [
  {
    ...defaultRadioGroupSporsmal(true),
    label:
      "Hvor sannsynlig er det at du kommer tilbake i jobben du ble sykmeldt fra?",
    options: [
      createRadioOption("Jeg tror det er veldig sannsynlig"),
      createRadioOption("Jeg tror det er lite sannsynlig"),
      createRadioOption("Jeg er usikker", true),
    ],
    selectedOptionId: "Jeg er usikker",
  },
  {
    ...defaultRadioGroupSporsmal(true),
    label:
      "Hvordan vil du beskrive samarbeidet og relasjonen mellom deg og arbeidsgiveren din?",
    options: [
      createRadioOption("Jeg opplever samarbeidet og relasjonen som god"),
      createRadioOption(
        "Jeg opplever samarbeidet og relasjonen som dårlig",
        true
      ),
    ],
    selectedOptionId: "Jeg opplever samarbeidet og relasjonen som dårlig",
  },
  {
    ...defaultRadioGroupSporsmal(true),
    label: "Hvor lenge tror du at du kommer til å være sykmeldt?",
    options: [
      createRadioOption("Mindre enn seks måneder", true),
      createRadioOption("Mer enn seks måneder"),
    ],
    selectedOptionId: "Mindre enn seks måneder",
  },
];

export const kartleggingssporsmalAnswered: KartleggingssporsmalSvarStatusResponseDTO =
  {
    formResponse: {
      uuid: crypto.randomUUID(),
      fnr: ARBEIDSTAKER_DEFAULT.personIdent,
      kandidatId: crypto.randomUUID(),
      createdAt: daysFromToday(5),
      formSnapshot: {
        formIdentifier: FormIdentifier.MEROPPFOLGING_KARTLEGGINGSSPORSMAL,
        formSemanticVersion: "1.0.0",
        fieldSnapshots: [...kartleggingssporsmal],
      },
    },
  };

export const kartleggingssporsmalNotAnswered: KartleggingssporsmalSvarStatusResponseDTO =
  {
    formResponse: null,
  };
