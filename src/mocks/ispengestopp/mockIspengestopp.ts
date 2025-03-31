import { ISPENGESTOPP_ROOT } from "@/apiConstants";
import { sykepengestoppList } from "./pengestoppStatusMock";
import { http, HttpResponse } from "msw";

const STATUSLIST = sykepengestoppList;

export const mockIspengestopp = [
  http.get(`${ISPENGESTOPP_ROOT}/person/status`, () => {
    return HttpResponse.json(STATUSLIST);
  }),
];
