import { ESYFOVARSEL_ROOT } from "@/apiConstants";
import { maksdatoMock } from "@/mocks/syfoperson/persondataMock";
import { mockServer } from "../setup";
import { http, HttpResponse } from "msw";

export const stubMaxdateApi = (maxDate: string) =>
  mockServer.use(
    http.get(`*${ESYFOVARSEL_ROOT}/sykepenger/maxdate`, () =>
      HttpResponse.json({
        maxDate: {
          ...maksdatoMock.maxDate,
          forelopig_beregnet_slutt: maxDate,
        },
      })
    )
  );
