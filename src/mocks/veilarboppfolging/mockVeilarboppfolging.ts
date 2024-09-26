import { VEILARBOPPFOLGING_ROOT } from "@/apiConstants";
import { http, HttpResponse } from "msw";

export const mockVeilarboppfolging = http.post(
  `${VEILARBOPPFOLGING_ROOT}/hent-underOppfolging`,
  () => {
    return HttpResponse.json({
      underOppfolging: true,
    });
  }
);
