import {
  LPS_OPPFOLGINGSPLAN_MOTTAK_V1_ROOT,
  SYFO_OPPFOLGINGSPLAN_BACKEND_ROOT,
} from "@/apiConstants";
import { oppfolgingsplanerLPSMock } from "@/mocks/lps-oppfolgingsplan-mottak/oppfolgingsplanLPSMock";
import { mockServer } from "../setup";
import { http, HttpResponse } from "msw";
import { oppfolgingsplanV2Mock } from "@/mocks/syfooppfolgingsplanbackend/oppfolgingsplanV2Mock";

export const stubOppfolgingsplanLPSApi = (created: Date) =>
  mockServer.use(
    http.get(`*${LPS_OPPFOLGINGSPLAN_MOTTAK_V1_ROOT}/oppfolgingsplan/lps`, () =>
      HttpResponse.json(oppfolgingsplanerLPSMock(created)),
    ),
  );

export function stubLegacyOppfolgingsplanApi(onRequest: () => void) {
  mockServer.use(
    http.all("*/syfooppfolgingsplanservice/*", () => {
      onRequest();
      return new HttpResponse(null, { status: 503 });
    }),
  );
}

export function stubGetOppfolgingsplanV2(onRequest?: (body: unknown) => void) {
  mockServer.use(
    http.post(
      `*${SYFO_OPPFOLGINGSPLAN_BACKEND_ROOT}/oppfolgingsplaner/query`,
      async ({ request }) => {
        onRequest?.(await request.json());
        return HttpResponse.json(oppfolgingsplanV2Mock);
      },
    ),
  );
}
