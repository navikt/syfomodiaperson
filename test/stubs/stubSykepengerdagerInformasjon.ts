import { SYKEPENGEDAGER_INFORMASJON_ROOT } from "@/apiConstants";
import { mockServer } from "../setup";
import { http, HttpResponse } from "msw";
import { maksdatoMock } from "@/mocks/syfoperson/persondataMock";

export const stubMaxdateApi = (maxDate: Date) =>
  mockServer.use(
    http.get(`*${SYKEPENGEDAGER_INFORMASJON_ROOT}/sykepenger/maxdate`, () =>
      HttpResponse.json({
        maxDate: {
          ...maksdatoMock.maxDate,
          forelopig_beregnet_slutt: maxDate,
        },
      })
    )
  );
