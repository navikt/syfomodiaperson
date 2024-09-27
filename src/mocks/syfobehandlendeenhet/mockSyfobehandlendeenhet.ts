import { SYFOBEHANDLENDEENHET_ROOT } from "@/apiConstants";
import {
  behandlendeEnhetMock,
  behandlendeEnhetNavUtlandMock,
  personDTOMock,
} from "./behandlendeEnhetMock";

import { BehandlendeEnhet } from "@/data/behandlendeenhet/types/BehandlendeEnhet";
import { http, HttpResponse } from "msw";

let behandlendeEnhet: BehandlendeEnhet = behandlendeEnhetMock;

export const mockSyfobehandlendeenhet = [
  http.get(`${SYFOBEHANDLENDEENHET_ROOT}/personident`, () => {
    return HttpResponse.json(behandlendeEnhet);
  }),
  http.post(`${SYFOBEHANDLENDEENHET_ROOT}/person`, () => {
    behandlendeEnhet =
      behandlendeEnhet === behandlendeEnhetNavUtlandMock
        ? behandlendeEnhetMock
        : behandlendeEnhetNavUtlandMock;
    return HttpResponse.json(personDTOMock);
  }),
];
