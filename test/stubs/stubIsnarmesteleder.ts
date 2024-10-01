import { ISNARMESTELEDER_ROOT } from "@/apiConstants";
import { ISNARMESTELEDER_NARMESTELEDERRELASJON_PERSONIDENT_PATH } from "@/data/leder/ledereQueryHooks";
import { mockServer } from "../setup";
import { http, HttpResponse } from "msw";

export const stubNarmestelederApi = (ledere: any) =>
  mockServer.use(
    http.get(
      `*${ISNARMESTELEDER_ROOT}${ISNARMESTELEDER_NARMESTELEDERRELASJON_PERSONIDENT_PATH}`,
      () => HttpResponse.json(ledere)
    )
  );
