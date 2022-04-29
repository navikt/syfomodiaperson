import nock from "nock";
import { ISDIALOGMOTE_ROOT } from "@/apiConstants";
import { dialogmoterMock } from "../../mock/isdialogmote/dialogmoterMock";

export const stubDialogmoterApi = (scope: nock.Scope) => {
  return scope
    .get(`${ISDIALOGMOTE_ROOT}/dialogmote/personident`)
    .reply(200, () => dialogmoterMock);
};

export const stubEndreApi = (scope: nock.Scope, dialogmoteUuid: string) => {
  return scope
    .post(`${ISDIALOGMOTE_ROOT}/dialogmote/${dialogmoteUuid}/tidsted`)
    .reply(200);
};

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

export const stubMellomlagreApi = (
  scope: nock.Scope,
  dialogmoteUuid: string
) => {
  return scope
    .post(`${ISDIALOGMOTE_ROOT}/dialogmote/${dialogmoteUuid}/mellomlagre`)
    .reply(200);
};
