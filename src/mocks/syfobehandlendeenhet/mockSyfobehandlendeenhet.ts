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
        oppfolgingsenhet: {
          enhetId: body.oppfolgingsenhet,
          navn: "Nav testkontor",
        },
      };
      return HttpResponse.json(responseDTO);
    }
  ),
];
