import { LUMI_API_ROOT } from "@/apiConstants";
import { http, HttpResponse } from "msw";

export const mockLumi = http.post(`${LUMI_API_ROOT}/feedback`, () => {
  return new HttpResponse(null, { status: 200 });
});
