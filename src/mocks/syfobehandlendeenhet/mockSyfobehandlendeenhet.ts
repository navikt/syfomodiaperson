import {
  SYSTEMBRUKER_IDENT_DEFAULT,
  VEILEDER_IDENT_DEFAULT,
} from "../common/mockConstants";
import { SYFOBEHANDLENDEENHET_ROOT } from "@/apiConstants";
import { behandlendeEnhetMockResponse } from "./behandlendeEnhetMock";
import { http, HttpResponse } from "msw";
import {
  BehandlendeEnhetResponseDTO,
  OppfolgingsenhetDTO,
  TildelOppfolgingsenhetRequestDTO,
  TildelOppfolgingsenhetResponseDTO,
} from "@/data/behandlendeenhet/types/BehandlendeEnhetDTOs";
import { Enhet } from "@/data/oppfolgingsenhet/useGetMuligeOppfolgingsenheter";
import { ENHET_GRUNERLOKKA } from "@/mocks/common/mockConstants";
import {
  Tildelt,
  TildeltHistorikkResponseDTO,
  TildeltTilbake,
  TildeltTilbakeAvSystem,
  TildeltType,
} from "@/hooks/historikk/useTildeltOppfolgingsenhetHistorikk";
import { currentOppfolgingstilfelle } from "@/mocks/isoppfolgingstilfelle/oppfolgingstilfellePersonMock";
import { addDays } from "@/utils/datoUtils";

let behandlendeEnhet: BehandlendeEnhetResponseDTO =
  behandlendeEnhetMockResponse;

const muligeoppfolgingsenheter: Enhet[] = [
  { enhetId: "0106", navn: "Nav Fredrikstad" },
  { enhetId: "0101", navn: "Nav Halden" },
  { enhetId: "0105", navn: "Nav Sarpsborg" },
  { enhetId: ENHET_GRUNERLOKKA.nummer, navn: ENHET_GRUNERLOKKA.navn },
];

const tildeltAvVeileder = {
  createdAt: addDays(currentOppfolgingstilfelle.start, 3),
  veilederident: VEILEDER_IDENT_DEFAULT,
  type: TildeltType.TILDELT_ANNEN_ENHET_AV_VEILEDER,
  enhet: {
    enhetId: ENHET_GRUNERLOKKA.nummer,
    navn: ENHET_GRUNERLOKKA.navn,
  },
} as Tildelt;

const tildeltTilbakeAvVeileder = {
  createdAt: addDays(currentOppfolgingstilfelle.start, 5),
  veilederident: VEILEDER_IDENT_DEFAULT,
  type: TildeltType.TILDELT_TILBAKE_TIL_GEOGRAFISK_ENHET_AV_VEILEDER,
} as TildeltTilbake;

export const tildeltOppfolgingsenhetHistorikk: TildeltHistorikkResponseDTO = {
  tildelteOppfolgingsenheter: [
    tildeltAvVeileder,
    tildeltTilbakeAvVeileder,
    {
      createdAt: addDays(currentOppfolgingstilfelle.start, 10),
      veilederident: SYSTEMBRUKER_IDENT_DEFAULT,
      type: TildeltType.TILDELT_TILBAKE_TIL_GEOGRAFISK_ENHET_AV_SYSTEM,
    } as TildeltTilbakeAvSystem,
  ],
};

const findEnhetById = (enhetId: string): Enhet | undefined =>
  muligeoppfolgingsenheter.find((enhet) => enhet.enhetId === enhetId);

export function mockGetMuligeTildelinger() {
  return http.get(
    `${SYFOBEHANDLENDEENHET_ROOT}/tilordningsenheter/:enhetId`,
    () => HttpResponse.json(muligeoppfolgingsenheter)
  );
}

function createOppfolgingsenhetDTO(
  body: TildelOppfolgingsenhetRequestDTO
): OppfolgingsenhetDTO {
  return {
    enhet: {
      enhetId: body.oppfolgingsenhet,
      navn: findEnhetById(body.oppfolgingsenhet)?.navn ?? "Nav testkontor",
    },
    createdAt: new Date(),
    veilederident: VEILEDER_IDENT_DEFAULT,
  };
}

function createTildeltTilbakeAvVeileder() {
  return {
    ...tildeltTilbakeAvVeileder,
    createdAt: new Date(),
  };
}

function createTildeltAvVeileder(body: TildelOppfolgingsenhetRequestDTO) {
  return {
    ...tildeltAvVeileder,
    enhet: {
      enhetId: body.oppfolgingsenhet,
      navn: findEnhetById(body.oppfolgingsenhet)?.navn ?? "Nav testkontor",
    },
    createdAt: new Date(),
  };
}

export const mockSyfobehandlendeenhet = [
  http.get(`${SYFOBEHANDLENDEENHET_ROOT}/personident`, () => {
    return HttpResponse.json(behandlendeEnhet);
  }),
  http.get(`${SYFOBEHANDLENDEENHET_ROOT}/historikk`, () => {
    return HttpResponse.json(tildeltOppfolgingsenhetHistorikk);
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

      const isGeografiskEnhet =
        body.oppfolgingsenhet === behandlendeEnhet.geografiskEnhet.enhetId;

      const oppfolgingsenhetDTO = isGeografiskEnhet
        ? null
        : createOppfolgingsenhetDTO(body);

      behandlendeEnhet = {
        ...behandlendeEnhet,
        oppfolgingsenhetDTO: oppfolgingsenhetDTO,
      };

      const tildeltHistorikk = isGeografiskEnhet
        ? createTildeltTilbakeAvVeileder()
        : createTildeltAvVeileder(body);

      tildeltOppfolgingsenhetHistorikk.tildelteOppfolgingsenheter.push(
        tildeltHistorikk
      );

      return HttpResponse.json(responseDTO);
    }
  ),
];
