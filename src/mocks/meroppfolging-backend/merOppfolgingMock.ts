import { MEROPPFOLGING_BACKEND_ROOT } from "@/apiConstants";
import { SenOppfolgingFormResponseDTOV2 } from "@/data/senoppfolging/senOppfolgingTypes";
import { ARBEIDSTAKER_DEFAULT } from "../common/mockConstants";
import { http, HttpResponse } from "msw";

export const mockMerOppfolging = http.get(
  `${MEROPPFOLGING_BACKEND_ROOT}/senoppfolging/formresponse`,
  () => {
    return HttpResponse.json(merOppfolgingMock);
  }
);

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
      questionText: "Har du behov for hjelp fra oss i NAV?",
      answerType: "JA",
      answerText: "Ja, jeg vil snakke med en veileder i NAV",
    },
  ],
};
