import { FLEXJAR_ROOT } from "@/apiConstants";
import { mockServer } from "../setup";
import { http, HttpResponse } from "msw";

export const stubFlexjarApiOk = () =>
  mockServer.use(
    http.post(
      `*${FLEXJAR_ROOT}/feedback/azure`,
      () => new HttpResponse(null, { status: 200 })
    )
  );

export const stubFlexjarApiError = () =>
  mockServer.use(
    http.post(
      `*${FLEXJAR_ROOT}/feedback/azure`,
      () => new HttpResponse(null, { status: 500 })
    )
  );
