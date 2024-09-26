import { ESYFOVARSEL_ROOT } from "@/apiConstants";
import { maksdatoMock } from "@/mocks/syfoperson/persondataMock";
import { http, HttpResponse } from "msw";

export const mockEsyfovarsel = http.get(
  `${ESYFOVARSEL_ROOT}/sykepenger/maxdate`,
  () => {
    return HttpResponse.json(maksdatoMock);
  }
);
