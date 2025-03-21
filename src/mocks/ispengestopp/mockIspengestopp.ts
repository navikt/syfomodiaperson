import { ISPENGESTOPP_ROOT } from "@/apiConstants";
import { statusEndringer } from "./pengestoppStatusMock";
import { http, HttpResponse } from "msw";
import { StatusEndring } from "@/data/pengestopp/types/FlaggPerson";

const STATUSLIST = statusEndringer;

export const mockIspengestopp = [
  http.get(`${ISPENGESTOPP_ROOT}/person/status`, () => {
    return HttpResponse.json(STATUSLIST);
  }),
];

export function addStatusEndring(statusEndring: StatusEndring) {
  STATUSLIST.push(statusEndring);
}
