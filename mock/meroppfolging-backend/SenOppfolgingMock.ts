import express = require("express");
import { MEROPPFOLGING_BACKEND_ROOT } from "../../src/apiConstants";
import { SenOppfolgingFormResponseDTOV2 } from "../../src/data/senoppfolging/SenOppfolgingTypes";
import { ARBEIDSTAKER_DEFAULT } from "../common/mockConstants";

export const mockMerOppfolging = (server: any) => {
  server.get(
    `${MEROPPFOLGING_BACKEND_ROOT}/senoppfolging/formresponse`,
    (req: express.Request, res: express.Response) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(senOppfolgingMock));
    }
  );
};

export const senOppfolgingMock: SenOppfolgingFormResponseDTOV2 = {
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
