import nock from "nock";
import { ISDIALOGMOTE_ROOT } from "@/apiConstants";

export const stubAvlysApi = (scope: nock.Scope, dialogmoteUuid: string) => {
  return scope
    .post(`${ISDIALOGMOTE_ROOT}/dialogmote/${dialogmoteUuid}/avlys`)
    .reply(200);
};

export const stubInnkallingApi = (scope: nock.Scope) => {
  return scope.post(`${ISDIALOGMOTE_ROOT}/dialogmote/personident`).reply(200);
};

export const stubFerdigstillApi = (
  scope: nock.Scope,
  dialogmoteUuid: string
) => {
  return scope
    .post(`${ISDIALOGMOTE_ROOT}/dialogmote/${dialogmoteUuid}/ferdigstill`)
    .reply(200);
};
