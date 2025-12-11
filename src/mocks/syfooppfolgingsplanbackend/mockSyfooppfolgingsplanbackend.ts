import { http, HttpResponse } from "msw";
import { SYFO_OPPFOLGINGSPLAN_BACKEND_ROOT } from "@/apiConstants";
import { oppfolgingsplanV2Mock } from "@/mocks/syfooppfolgingsplanbackend/oppfolgingsplanV2Mock";

export const mockSyfooppfolgingsplanbackend = [
  http.post(
    `${SYFO_OPPFOLGINGSPLAN_BACKEND_ROOT}/oppfolgingsplaner/query`,
    () => HttpResponse.json(oppfolgingsplanV2Mock)
  ),
];
