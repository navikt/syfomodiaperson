import nock from "nock";
import { SYFOMOTEBEHOV_ROOT } from "@/apiConstants";
import { historikkmotebehovMock } from "@/mocks/syfomotebehov/historikkmotebehovMock";

export const stubMotebehovHistorikkApi = (scope: nock.Scope) => {
  scope
    .get(`${SYFOMOTEBEHOV_ROOT}/historikk`)
    .reply(200, () => historikkmotebehovMock);
};
