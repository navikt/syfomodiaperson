import React from "react";
import {
  LumiSurveyDock,
  type LumiSurveyConfig,
  type LumiSurveyTransport,
} from "@navikt/lumi-survey";
import { LUMI_API_ROOT } from "@/apiConstants";
import { post } from "@/api/axios";

const transport: LumiSurveyTransport = {
  async submit(submission) {
    await post(`${LUMI_API_ROOT}/feedback`, submission.transportPayload);
  },
};

interface Props {
  surveyId: string;
  survey: LumiSurveyConfig;
}

/** Wrapper rundt LumiSurveyDock som sender tilbakemeldinger via BFF-proxyen til lumi-api. */
export default function LumiSurvey({ surveyId, survey }: Props) {
  return (
    <LumiSurveyDock
      surveyId={surveyId}
      survey={survey}
      transport={transport}
      behavior={{ storageStrategy: "localStorage" }}
    />
  );
}
