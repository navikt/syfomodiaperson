import nock from "nock";
import { SYFOMOTEBEHOV_ROOT } from "@/apiConstants";
import { historikkmotebehovMock } from "../../mock/syfomotebehov/historikkmotebehovMock";

export const stubMotebehovHistorikkApi = (scope: nock.Scope, fnr: string) => {
  scope
    .get(`${SYFOMOTEBEHOV_ROOT}/historikk?fnr=${fnr}`)
    .reply(200, () => historikkmotebehovMock);
};
