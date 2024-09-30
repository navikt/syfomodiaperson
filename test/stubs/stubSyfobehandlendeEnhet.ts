import { SYFOBEHANDLENDEENHET_ROOT } from "@/apiConstants";
import {
  BehandlendeEnhet,
  PersonDTO,
} from "@/data/behandlendeenhet/types/BehandlendeEnhet";
import { mockServer } from "../setup";
import { http, HttpResponse } from "msw";

export const stubBehandlendeEnhetApi = (enhet?: BehandlendeEnhet) =>
  mockServer.use(
    http.get(`*${SYFOBEHANDLENDEENHET_ROOT}/personident`, () =>
      HttpResponse.json(enhet)
    )
  );

export const stubChangeEnhetApi = (person?: PersonDTO) =>
  mockServer.use(
    http.post(`*${SYFOBEHANDLENDEENHET_ROOT}/person`, () =>
      HttpResponse.json(person)
    )
  );
