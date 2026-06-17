import React, { ComponentProps } from "react";
import {
  type LumiSurveyConfig,
  LumiSurveyDock,
  type LumiSurveyTransport,
} from "@navikt/lumi-survey";
import { LUMI_API_ROOT } from "@/apiConstants";
import { post } from "@/api/axios";

const transport: LumiSurveyTransport = {
  async submit(submission) {
    await post(`${LUMI_API_ROOT}/feedback`, submission.transportPayload);
  },
};

type Props = {
  surveyId: string;
  survey: LumiSurveyConfig;
} & Partial<ComponentProps<typeof LumiSurveyDock>>;

/** Wrapper rundt LumiSurveyDock som sender tilbakemeldinger via BFF-proxyen til lumi-api. */
export default function LumiSurvey({
  surveyId,
  survey,
  behavior,
  context,
}: Props) {
  return (
    <LumiSurveyDock
      surveyId={surveyId}
      survey={survey}
      context={context}
      transport={transport}
      behavior={{ storageStrategy: "localStorage", ...behavior }}
    />
  );
}
