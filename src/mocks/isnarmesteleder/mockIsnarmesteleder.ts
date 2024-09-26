import { ledereMock } from "./ledereMock";
import { ISNARMESTELEDER_ROOT } from "@/apiConstants";
import { http, HttpResponse } from "msw";

export const mockIsnarmesteleder = http.get(
  `${ISNARMESTELEDER_ROOT}/narmestelederrelasjon/personident`,
  () => {
    return HttpResponse.json(ledereMock);
  }
);
