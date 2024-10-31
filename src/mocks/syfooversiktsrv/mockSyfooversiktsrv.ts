import { SYFOOVERSIKTSRV_PERSONTILDELING_ROOT } from "@/apiConstants";
import { VEILEDER_BRUKER_KNYTNING_DEFAULT } from "../common/mockConstants";
import { http, HttpResponse } from "msw";

let veilederBrukerKnytningMock = VEILEDER_BRUKER_KNYTNING_DEFAULT;

export const mockSyfooversiktsrv = [
  http.get(`${SYFOOVERSIKTSRV_PERSONTILDELING_ROOT}/personer/single`, () => {
    return HttpResponse.json(veilederBrukerKnytningMock);
  }),

  http.post<object, { veilederIdent: string }>(
    `${SYFOOVERSIKTSRV_PERSONTILDELING_ROOT}/personer/single`,
    async ({ request }) => {
      const { veilederIdent } = await request.json();
      veilederBrukerKnytningMock = {
        ...veilederBrukerKnytningMock,
        tildeltVeilederident: veilederIdent,
      };
      return new HttpResponse(null, { status: 200 });
    }
  ),
  http.get(`${SYFOOVERSIKTSRV_PERSONTILDELING_ROOT}/historikk`, () => {
    return HttpResponse.json([
      {
        tildeltDato: "2024-10-15",
        tildeltAv: "A123456",
        tildeltVeileder: "B123456",
        tildeltEnhet: "0315",
      },
      {
        tildeltDato: "2024-02-21",
        tildeltAv: "X000000",
        tildeltVeileder: "A123456",
        tildeltEnhet: "0315",
      },
    ]);
  }),
];
