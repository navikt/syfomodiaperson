import { ISDIALOGMOTEKANDIDAT_ROOT } from "@/apiConstants";
import { dialogmotekandidatMock } from "@/mocks/isdialogmotekandidat/dialogmotekandidatMock";
import { mockServer } from "../setup";
import { http, HttpResponse } from "msw";

export const stubDialogmoteKandidatApi = () =>
  mockServer.use(
    http.get(`*${ISDIALOGMOTEKANDIDAT_ROOT}/kandidat/personident`, () =>
      HttpResponse.json(dialogmotekandidatMock)
    )
  );
