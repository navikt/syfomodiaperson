import { SYFOVEILEDER_ROOT } from "../../apiConstants";
import { ANNEN_VEILEDER, VEILEDER_DEFAULT } from "../common/mockConstants";
import { http, HttpResponse } from "msw";

const veiledereMock = [VEILEDER_DEFAULT, ANNEN_VEILEDER];

export const mockSyfoveileder = [
  http.get(`${SYFOVEILEDER_ROOT}/veiledere/self`, () => {
    return HttpResponse.json(VEILEDER_DEFAULT);
  }),

  http.get(`${SYFOVEILEDER_ROOT}/veiledere`, () => {
    return HttpResponse.json(veiledereMock);
  }),

  http.get<{ ident: string }>(
    `${SYFOVEILEDER_ROOT}/veiledere/:ident`,
    ({ params }) => {
      const veileder = veiledereMock.find(
        (veileder) => veileder.ident === params.ident
      );

      return HttpResponse.json(veileder);
    }
  ),
];
