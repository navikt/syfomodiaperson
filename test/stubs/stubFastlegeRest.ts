import { FASTLEGEREST_ROOT } from "@/apiConstants";
import { fastlegerMock } from "@/mocks/fastlegerest/fastlegerMock";
import { mockServer } from "../setup";
import { http, HttpResponse } from "msw";

export const stubFastlegerApi = () =>
  mockServer.use(
    http.get(`*${FASTLEGEREST_ROOT}/fastleger`, () =>
      HttpResponse.json(fastlegerMock)
    )
  );
