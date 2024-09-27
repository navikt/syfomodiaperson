import { SYFOOVERSIKTSRV_PERSONTILDELING_ROOT } from "@/apiConstants";
import { mockServer } from "../setup";
import { http, HttpResponse } from "msw";

export const stubSyfooversiktsrvPersontildelingNoContent = () =>
  mockServer.use(
    http.get(
      `*${SYFOOVERSIKTSRV_PERSONTILDELING_ROOT}/personer/single`,
      () => new HttpResponse(null, { status: 204 })
    )
  );

export const stubSyfooversiktsrvPersontildelingRegistrerOK = () =>
  mockServer.use(
    http.get(
      `*${SYFOOVERSIKTSRV_PERSONTILDELING_ROOT}/registrer`,
      () => new HttpResponse(null, { status: 200 })
    )
  );
