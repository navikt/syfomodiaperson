import { ISAKTIVITETSKRAV_ROOT } from "@/apiConstants";
import { aktivitetskravMock } from "@/mocks/isaktivitetskrav/aktivitetskravMock";
import { mockServer } from "../setup";
import { http, HttpResponse } from "msw";

export const stubAktivitetskravApi = () =>
  mockServer.use(
    http.get(`*${ISAKTIVITETSKRAV_ROOT}/aktivitetskrav/personident`, () =>
      HttpResponse.json(aktivitetskravMock)
    )
  );

export const stubVurderAktivitetskravApi = (aktivitetskravUuid: string) =>
  mockServer.use(
    http.post(
      `*${ISAKTIVITETSKRAV_ROOT}/aktivitetskrav/${aktivitetskravUuid}/vurder`,
      () => new HttpResponse(null, { status: 200 })
    )
  );

export const stubVurderAktivitetskravForhandsvarselApi = (
  aktivitetskravUuid: string
) =>
  mockServer.use(
    http.post(
      `*${ISAKTIVITETSKRAV_ROOT}/aktivitetskrav/${aktivitetskravUuid}/forhandsvarsel`,
      () => new HttpResponse(null, { status: 200 })
    )
  );
