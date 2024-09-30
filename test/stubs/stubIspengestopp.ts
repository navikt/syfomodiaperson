import { ISPENGESTOPP_ROOT } from "@/apiConstants";
import { createStatusList } from "@/mocks/ispengestopp/pengestoppStatusMock";
import { mockServer } from "../setup";
import { http, HttpResponse } from "msw";

export const stubPengestoppStatusApi = (created: Date) =>
  mockServer.use(
    http.get(`*${ISPENGESTOPP_ROOT}/person/status`, () =>
      HttpResponse.json(createStatusList(created))
    )
  );
