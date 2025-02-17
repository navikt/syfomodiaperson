import { motebehovMock } from "./motebehovMock";
import { SYFOMOTEBEHOV_ROOT } from "@/apiConstants";
import { VEILEDER_IDENT_DEFAULT } from "../common/mockConstants";
import { http, HttpResponse } from "msw";
import { MotebehovVeilederDTO } from "@/data/motebehov/types/motebehovTypes";

let mockedMotebehov = motebehovMock;

export const mockSyfomotebehov = [
  http.get(`${SYFOMOTEBEHOV_ROOT}/motebehov`, () => {
    return HttpResponse.json(mockedMotebehov);
  }),

  http.post(`${SYFOMOTEBEHOV_ROOT}/motebehov/behandle`, () => {
    const oppdaterteMotebehov: MotebehovVeilederDTO[] = mockedMotebehov.map(
      (motebehov) => {
        return {
          ...motebehov,
          behandletTidspunkt: new Date(),
          behandletVeilederIdent: VEILEDER_IDENT_DEFAULT,
        };
      }
    ) as unknown as MotebehovVeilederDTO[];

    mockedMotebehov = [...oppdaterteMotebehov];

    return new HttpResponse(null, { status: 200 });
  }),
];
