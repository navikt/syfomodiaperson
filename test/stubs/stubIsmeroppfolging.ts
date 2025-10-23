import { http, HttpResponse } from "msw";
import { ISMEROPPFOLGING_ROOT } from "@/apiConstants";
import { mockIsmeroppfolging } from "@/mocks/ismeroppfolging/mockIsmeroppfolging";
import { mockServer } from "../setup";

export const stubDefaultIsmeroppfolging = () =>
  mockServer.use(...mockIsmeroppfolging);

export const stubVurderSvarError = () =>
  mockServer.use(
    http.put(
      `${ISMEROPPFOLGING_ROOT}/kartleggingssporsmal/kandidater/:kandidatUUID`,
      () => {
        return HttpResponse.text("Internal server error", { status: 500 });
      }
    )
  );
