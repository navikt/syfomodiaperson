import nock from "nock";
import { ISDIALOGMOTEKANDIDAT_ROOT } from "@/apiConstants";
import { dialogmotekandidatMock } from "../../mock/isdialogmotekandidat/dialogmotekandidatMock";

export const stubDialogmoteKandidatApi = (scope: nock.Scope) => {
  return scope
    .get(`${ISDIALOGMOTEKANDIDAT_ROOT}/kandidat/personident`)
    .reply(200, () => dialogmotekandidatMock);
};
