import { LPS_OPPFOLGINGSPLAN_MOTTAK_V1_ROOT } from "@/apiConstants";

import { oppfolgingsplanerLPSMock } from "../lps-oppfolgingsplan-mottak/oppfolgingsplanLPSMock";
import { http, HttpResponse } from "msw";

export const mockLpsOppfolgingsplanerMottak = [
  http.get(`${LPS_OPPFOLGINGSPLAN_MOTTAK_V1_ROOT}/oppfolgingsplan/lps`, () => {
    return HttpResponse.json(oppfolgingsplanerLPSMock(new Date()));
  }),

  http.get(
    `${LPS_OPPFOLGINGSPLAN_MOTTAK_V1_ROOT}/oppfolgingsplan/lps/:uuid`,
    () => {
      return HttpResponse.text("PDF");
    }
  ),
];
