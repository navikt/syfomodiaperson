import { fastlegerMock } from "./fastlegerMock";
import { FASTLEGEREST_ROOT } from "@/apiConstants";
import { http, HttpResponse } from "msw";

export const mockFastlegerest = http.get(
  `${FASTLEGEREST_ROOT}/fastleger`,
  () => {
    return HttpResponse.json(fastlegerMock);
  }
);
