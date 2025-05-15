import { VEILEDER_IDENT_DEFAULT } from "../common/mockConstants";
import { SYFOBEHANDLENDEENHET_ROOT } from "@/apiConstants";
import { behandlendeEnhetMockResponse } from "./behandlendeEnhetMock";
import { http, HttpResponse } from "msw";
import {
  BehandlendeEnhetResponseDTO,
  TildelOppfolgingsenhetRequestDTO,
  TildelOppfolgingsenhetResponseDTO,
} from "@/data/behandlendeenhet/types/BehandlendeEnhetDTOs";

let behandlendeEnhet: BehandlendeEnhetResponseDTO =
  behandlendeEnhetMockResponse;

export const mockSyfobehandlendeenhet = [
  http.get(`${SYFOBEHANDLENDEENHET_ROOT}/personident`, () => {
    return HttpResponse.json(behandlendeEnhet);
  }),
  http.post<object, TildelOppfolgingsenhetRequestDTO>(
    `${SYFOBEHANDLENDEENHET_ROOT}/oppfolgingsenhet-tildelinger`,
    async ({ request }) => {
      const body = await request.json();
      const responseDTO: TildelOppfolgingsenhetResponseDTO = {
        tildelinger: body.personidenter.map((personident: string) => ({
          personident,
          oppfolgingsenhet: body.oppfolgingsenhet,
        })),
        errors: [],
      };
      behandlendeEnhet = {
        ...behandlendeEnhet,
        oppfolgingsenhetDTO: {
          enhet: {
            enhetId: body.oppfolgingsenhet,
            navn: "Nav testkontor",
          },
          createdAt: new Date("2024-10-15"),
          veilederident: VEILEDER_IDENT_DEFAULT,
        },
      };
      return HttpResponse.json(responseDTO);
    }
  ),
];
