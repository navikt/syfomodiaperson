import nock from "nock";
import { ISPENGESTOPP_ROOT } from "@/apiConstants";
import { createStatusList } from "../../mock/ispengestopp/pengestoppStatusMock";

export const stubPengestoppStatusApi = (scope: nock.Scope, created: Date) => {
  return scope
    .get(`${ISPENGESTOPP_ROOT}/person/status`)
    .reply(200, () => createStatusList(created));
};
