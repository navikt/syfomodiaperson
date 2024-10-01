import {
  LPS_OPPFOLGINGSPLAN_MOTTAK_V1_ROOT,
  SYFOOPPFOLGINGSPLANSERVICE_V2_ROOT,
  SYFOOPPFOLGINGSPLANSERVICE_V3_ROOT,
} from "@/apiConstants";
import { oppfolgingsplanMock } from "@/mocks/syfooppfolgingsplanservice/oppfolgingsplanMock";
import { dokumentinfoMock } from "@/mocks/syfooppfolgingsplanservice/dokumentinfoMock";
import { historikkoppfolgingsplanMock } from "@/mocks/syfooppfolgingsplanservice/historikkoppfolgingsplanMock";
import { oppfolgingsplanerLPSMock } from "@/mocks/lps-oppfolgingsplan-mottak/oppfolgingsplanLPSMock";
import { mockServer } from "../setup";
import { http, HttpResponse } from "msw";

export const stubOppfolgingsplanApi = () =>
  mockServer.use(
    http.get(`*${SYFOOPPFOLGINGSPLANSERVICE_V3_ROOT}/oppfolgingsplan`, () =>
      HttpResponse.json(oppfolgingsplanMock)
    )
  );

export const stubOppfolgingsplanLPSApi = (created: Date) =>
  mockServer.use(
    http.get(`*${LPS_OPPFOLGINGSPLAN_MOTTAK_V1_ROOT}/oppfolgingsplan/lps`, () =>
      HttpResponse.json(oppfolgingsplanerLPSMock(created))
    )
  );

export const stubDokumentinfoApi = (oppfolgingsplanId: number) =>
  mockServer.use(
    http.get(
      `*${SYFOOPPFOLGINGSPLANSERVICE_V2_ROOT}/dokument/${oppfolgingsplanId}/dokumentinfo`,
      () => HttpResponse.json(dokumentinfoMock)
    )
  );

export const stubOppfolgingsplanHistorikkApi = () =>
  mockServer.use(
    http.get(
      `*${SYFOOPPFOLGINGSPLANSERVICE_V3_ROOT}/oppfolgingsplan/historikk`,
      () => HttpResponse.json(historikkoppfolgingsplanMock)
    )
  );
