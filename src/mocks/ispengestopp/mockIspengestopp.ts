import { ISPENGESTOPP_ROOT } from "@/apiConstants";
import { createStatusList } from "./pengestoppStatusMock";
import { http, HttpResponse } from "msw";
import { StoppAutomatikk } from "@/data/pengestopp/types/FlaggPerson";

let STATUSLIST: any;

export const mockIspengestopp = [
  http.get(`${ISPENGESTOPP_ROOT}/person/status`, () => {
    return !STATUSLIST
      ? new HttpResponse(null, { status: 204 })
      : HttpResponse.json(STATUSLIST);
  }),
  http.post<object, StoppAutomatikk>(
    `${ISPENGESTOPP_ROOT}/person/flagg`,
    async ({ request }) => {
      const body = await request.json();
      STATUSLIST = createStatusList(new Date(), body);

      return new HttpResponse(null, { status: 201 });
    }
  ),
];
