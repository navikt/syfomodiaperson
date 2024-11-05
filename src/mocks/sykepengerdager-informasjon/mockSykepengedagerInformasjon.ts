import { SYKEPENGEDAGER_INFORMASJON_ROOT } from "@/apiConstants";
import { maksdatoMock } from "@/mocks/syfoperson/persondataMock";
import { http, HttpResponse } from "msw";

export const mockSykepengedagerInformasjon = http.get(
  `${SYKEPENGEDAGER_INFORMASJON_ROOT}/sykepenger/maxdate`,
  () => {
    return HttpResponse.json(maksdatoMock);
  }
);
