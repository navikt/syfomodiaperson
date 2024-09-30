import { SYFOVEILEDER_ROOT } from "@/apiConstants";
import {
  VEILEDER_DEFAULT,
  VEILEDER_IDENT_DEFAULT,
} from "@/mocks/common/mockConstants";
import { http, HttpResponse } from "msw";
import { mockServer } from "../setup";

export const stubVeilederinfoApi = () =>
  mockServer.use(
    http.get(`*${SYFOVEILEDER_ROOT}/veiledere/${VEILEDER_IDENT_DEFAULT}`, () =>
      HttpResponse.json(VEILEDER_DEFAULT)
    )
  );
