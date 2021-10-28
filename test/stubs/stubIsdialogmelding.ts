import nock from "nock";
import { ISDIALOGMELDING_ROOT } from "@/apiConstants";
import { behandlereDialogmeldingMock } from "../../mock/isdialogmelding/behandlereDialogmeldingMock";

export const stubBehandlereDialogmeldingApi = (scope: nock.Scope) => {
  return scope
    .get(`${ISDIALOGMELDING_ROOT}/behandler/personident`)
    .reply(200, () => behandlereDialogmeldingMock);
};
