import { FLEXJAR_ROOT } from "@/apiConstants";
import { http, HttpResponse } from "msw";

export const mockFlexjar = http.post(`${FLEXJAR_ROOT}/feedback/azure`, () => {
  return new HttpResponse(null, { status: 200 });
});
