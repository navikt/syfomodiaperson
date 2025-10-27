import {
  MEROPPFOLGING_BACKEND_V1_ROOT,
  MEROPPFOLGING_BACKEND_V2_ROOT,
} from "@/apiConstants";
import { SenOppfolgingFormResponseDTOV2 } from "@/data/senoppfolging/senOppfolgingTypes";
import { ARBEIDSTAKER_DEFAULT } from "../common/mockConstants";
import { http, HttpResponse } from "msw";
import { KartleggingssporsmalSvarResponseDTO } from "@/data/kartleggingssporsmal/kartleggingssporsmalTypes";
import {
  FormIdentifier,
  FormSnapshotFieldOption,
  FormSnapshotFieldType,
  RadioGroupFieldSnapshotV2,
} from "@/data/skjemasvar/types/SkjemasvarTypes";
import { daysFromToday } from "../../../test/testUtils";
import { generateUUID } from "@/utils/utils";

export const mockMerOppfolging = [
  http.get(
    `${MEROPPFOLGING_BACKEND_V2_ROOT}/senoppfolging/formresponse`,
    () => {
      return HttpResponse.json(merOppfolgingMock);
    }
  ),
  http.get(
    `${MEROPPFOLGING_BACKEND_V1_ROOT}/kartleggingssporsmal/:kandidatUUID/svar`,
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
  label: string,
  isSelected = false
): FormSnapshotFieldOption => {
  return {
    optionId: label,
    optionLabel: label,
    wasSelected: isSelected,
  };
};

export const defaultRadioGroupSporsmal: RadioGroupFieldSnapshotV2 = {
  fieldId: "hvorSannsynligTilbakeTilJobben",
  fieldType: FormSnapshotFieldType.RADIO_GROUP,
  description: null,
  label: "Label 1",
  options: [createRadioOption("Ja", true), createRadioOption("Nei")],
  wasRequired: true,
};

const kartleggingssporsmal: RadioGroupFieldSnapshotV2[] = [
  {
    ...defaultRadioGroupSporsmal,
    label:
      "Hvor sannsynlig er det at du kommer tilbake i jobben du ble sykmeldt fra?",
    options: [
      createRadioOption("Jeg tror det er veldig sannsynlig"),
      createRadioOption("Jeg tror det er lite sannsynlig"),
      createRadioOption("Jeg er usikker", true),
    ],
  },
  {
    ...defaultRadioGroupSporsmal,
    label:
      "Hvordan vil du beskrive samarbeidet og relasjonen mellom deg og arbeidsgiveren din?",
    options: [
      createRadioOption("Jeg opplever samarbeidet og relasjonen som god"),
      createRadioOption(
        "Jeg opplever samarbeidet og relasjonen som dårlig",
        true
      ),
    ],
  },
  {
    ...defaultRadioGroupSporsmal,
    label: "Hvor lenge tror du at du kommer til å være sykmeldt?",
    options: [
      createRadioOption("Mindre enn seks måneder", true),
      createRadioOption("Mer enn seks måneder"),
    ],
  },
];

export const kartleggingssporsmalAnswered: KartleggingssporsmalSvarResponseDTO =
  {
    uuid: generateUUID(),
    fnr: ARBEIDSTAKER_DEFAULT.personIdent,
    kandidatId: generateUUID(),
    createdAt: daysFromToday(-2),
    formSnapshot: {
      formIdentifier: FormIdentifier.MEROPPFOLGING_KARTLEGGINGSSPORSMAL,
      formSemanticVersion: "1.0.0",
      fieldSnapshots: [...kartleggingssporsmal],
    },
  };

export const kartleggingssporsmalNotAnswered: KartleggingssporsmalSvarResponseDTO | null =
  null;
