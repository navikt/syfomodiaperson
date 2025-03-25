import { ISPENGESTOPP_ROOT } from "@/apiConstants";
import { sykepengestoppList } from "./pengestoppStatusMock";
import { http, HttpResponse } from "msw";

const STATUSLIST = sykepengestoppList;

export const mockIspengestopp = [
  http.get(`${ISPENGESTOPP_ROOT}/person/status`, () => {
    return !STATUSLIST
      ? new HttpResponse(null, { status: 204 })
      : HttpResponse.json(STATUSLIST);
  }),
];
