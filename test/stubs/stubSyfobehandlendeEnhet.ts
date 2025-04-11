import { SYFOBEHANDLENDEENHET_ROOT } from "@/apiConstants";
import { mockServer } from "../setup";
import { http, HttpResponse } from "msw";
import { BehandlendeEnhetResponseDTO } from "@/data/behandlendeenhet/types/BehandlendeEnhetDTOs";

export const stubBehandlendeEnhetApi = (
  behandlendeEnhet?: BehandlendeEnhetResponseDTO
) =>
  mockServer.use(
    http.get(`*${SYFOBEHANDLENDEENHET_ROOT}/personident`, () =>
      HttpResponse.json(behandlendeEnhet)
    )
  );
