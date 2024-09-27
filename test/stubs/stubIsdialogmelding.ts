import { ISDIALOGMELDING_ROOT } from "@/apiConstants";
import { behandlereDialogmeldingMock } from "@/mocks/isdialogmelding/behandlereDialogmeldingMock";
import { mockServer } from "../setup";
import { http, HttpResponse } from "msw";

export const stubBehandlereDialogmeldingApi = () =>
  mockServer.use(
    http.get(`*${ISDIALOGMELDING_ROOT}/behandler/personident`, () =>
      HttpResponse.json(behandlereDialogmeldingMock)
    )
  );
