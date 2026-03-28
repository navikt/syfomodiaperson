import { ISDIALOGMOTE_ROOT_V2 } from "@/apiConstants";
import { dialogmoterMock } from "@/mocks/isdialogmote/dialogmoterMock";
import { mockServer } from "../setup";
import { http, HttpResponse } from "msw";

export const stubDialogmoterApi = () =>
  mockServer.use(
    http.get(`*${ISDIALOGMOTE_ROOT_V2}/dialogmote/personident`, () =>
      HttpResponse.json(dialogmoterMock)
    )
  );

export const stubEndreApi = (dialogmoteUuid: string) =>
  mockServer.use(
    http.post(
      `*${ISDIALOGMOTE_ROOT_V2}/dialogmote/${dialogmoteUuid}/endre`,
      () => new HttpResponse(null, { status: 200 })
    )
  );

export const stubAvlysApi = (dialogmoteUuid: string) =>
  mockServer.use(
    http.post(
      `*${ISDIALOGMOTE_ROOT_V2}/dialogmote/${dialogmoteUuid}/avlys`,
      () => new HttpResponse(null, { status: 200 })
    )
  );

export const stubInnkallingApi = () =>
  mockServer.use(
    http.post(
      `*${ISDIALOGMOTE_ROOT_V2}/dialogmote/personident`,
      () => new HttpResponse(null, { status: 200 })
    )
  );

export const stubFerdigstillApi = (dialogmoteUuid: string) =>
  mockServer.use(
    http.post(
      `*${ISDIALOGMOTE_ROOT_V2}/dialogmote/${dialogmoteUuid}/ferdigstill`,
      () => new HttpResponse(null, { status: 200 })
    )
  );

export const stubMellomlagreApi = (dialogmoteUuid: string) =>
  mockServer.use(
    http.post(
      `*${ISDIALOGMOTE_ROOT_V2}/dialogmote/${dialogmoteUuid}/mellomlagre`,
      () => new HttpResponse(null, { status: 200 })
    )
  );
