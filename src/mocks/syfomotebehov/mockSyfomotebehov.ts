import { motebehovMock } from "./motebehovMock";
import { SYFOMOTEBEHOV_ROOT } from "@/apiConstants";
import { http, HttpResponse } from "msw";

const mockedMotebehov = motebehovMock;

export const mockSyfomotebehov = [
  http.get(`${SYFOMOTEBEHOV_ROOT}/motebehov`, () => {
    return HttpResponse.json(mockedMotebehov);
  }),
];
