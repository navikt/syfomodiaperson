import { ISARBEIDSUFORHET_ROOT } from "@/apiConstants";
import { mockServer } from "../setup";
import { http, HttpResponse } from "msw";

export const stubArbeidsuforhetForhandsvarselApi = () =>
  mockServer.use(
    http.post(
      `*${ISARBEIDSUFORHET_ROOT}/arbeidsuforhet/forhandsvarsel`,
      () => new HttpResponse(null, { status: 201 })
    )
  );
