import nock from "nock";
import { SYFOVEILEDER_ROOT } from "@/apiConstants";
import {
  VEILEDER_DEFAULT,
  VEILEDER_IDENT_DEFAULT,
} from "../../mock/common/mockConstants";

export const stubAktivVeilederinfoApi = (scope: nock.Scope) =>
  scope
    .get(`${SYFOVEILEDER_ROOT}/veiledere/self`)
    .reply(200, () => VEILEDER_DEFAULT);

export const stubVeilederinfoApi = (scope: nock.Scope) =>
  scope
    .get(`${SYFOVEILEDER_ROOT}/veiledere/${VEILEDER_IDENT_DEFAULT}`)
    .reply(200, () => VEILEDER_DEFAULT);
