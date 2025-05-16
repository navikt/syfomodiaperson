import { VEILEDER_IDENT_DEFAULT } from "../common/mockConstants";
import { SYFOBEHANDLENDEENHET_ROOT } from "@/apiConstants";
import { behandlendeEnhetMockResponse } from "./behandlendeEnhetMock";
import { http, HttpResponse } from "msw";
import {
  BehandlendeEnhetResponseDTO,
  TildelOppfolgingsenhetRequestDTO,
  TildelOppfolgingsenhetResponseDTO,
} from "@/data/behandlendeenhet/types/BehandlendeEnhetDTOs";
import { Enhet } from "@/data/oppfolgingsenhet/useGetMuligeOppfolgingsenheter";
import { ENHET_GRUNERLOKKA } from "@/mocks/common/mockConstants";

let behandlendeEnhet: BehandlendeEnhetResponseDTO =
  behandlendeEnhetMockResponse;

const muligeoppfolgingsenheter: Enhet[] = [
  { enhetId: "0106", navn: "Nav Fredrikstad" },
  { enhetId: "0101", navn: "Nav Halden" },
  { enhetId: "0105", navn: "Nav Sarpsborg" },
  { enhetId: ENHET_GRUNERLOKKA.nummer, navn: ENHET_GRUNERLOKKA.navn },
];

const findEnhetById = (enhetId: string): Enhet | undefined =>
  muligeoppfolgingsenheter.find((enhet) => enhet.enhetId === enhetId);

export function mockGetMuligeTildelinger() {
  return http.get(
    `${SYFOBEHANDLENDEENHET_ROOT}/tilordningsenheter/:enhetId`,
    () => HttpResponse.json(muligeoppfolgingsenheter)
  );
}

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
            navn:
              findEnhetById(body.oppfolgingsenhet)?.navn ?? "Nav testkontor",
          },
          createdAt: new Date(),
          veilederident: VEILEDER_IDENT_DEFAULT,
        },
      };
      return HttpResponse.json(responseDTO);
    }
  ),
];
