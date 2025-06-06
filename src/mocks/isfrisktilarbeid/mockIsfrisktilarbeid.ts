import { ISFRISKTILARBEID_ROOT } from "@/apiConstants";
import { NAV_PERSONIDENT_HEADER } from "../util/requestUtil";
import { generateUUID } from "@/utils/utils";
import { VEILEDER_DEFAULT } from "../common/mockConstants";
import {
  InfotrygdStatus,
  VedtakRequestDTO,
  VedtakResponseDTO,
  VilkarResponseDTO,
} from "@/data/frisktilarbeid/frisktilarbeidTypes";
import dayjs from "dayjs";
import { addWeeks } from "@/utils/datoUtils";
import { http, HttpResponse } from "msw";

export const defaultVedtak: VedtakResponseDTO = {
  uuid: "123",
  createdAt: new Date(),
  veilederident: "Z999999",
  begrunnelse: "En begrunnelse",
  fom: new Date(),
  tom: addWeeks(new Date(), 12),
  document: [],
  infotrygdStatus: InfotrygdStatus.KVITTERING_OK,
  ferdigbehandletAt: undefined,
  ferdigbehandletBy: undefined,
};

export const defaultVilkar: VilkarResponseDTO = {
  isArbeidssoker: true,
};

let vedtak: VedtakResponseDTO[] = [];

export const mockIsfrisktilarbeid = [
  http.get(`${ISFRISKTILARBEID_ROOT}/frisktilarbeid/vedtak`, () => {
    return HttpResponse.json(vedtak);
  }),

  http.get(`${ISFRISKTILARBEID_ROOT}/frisktilarbeid/vedtak-vilkar`, () => {
    return HttpResponse.json(defaultVilkar);
  }),

  http.post<object, VedtakRequestDTO>(
    `${ISFRISKTILARBEID_ROOT}/frisktilarbeid/vedtak`,
    async ({ request }) => {
      const body = await request.json();
      const sentVedtak: VedtakResponseDTO = {
        uuid: generateUUID(),
        createdAt: new Date(),
        veilederident: VEILEDER_DEFAULT.ident,
        begrunnelse: body.begrunnelse,
        document: body.document,
        fom: new Date(body.fom),
        tom: new Date(body.tom),
        infotrygdStatus: InfotrygdStatus.KVITTERING_OK,
        ferdigbehandletAt: undefined,
        ferdigbehandletBy: undefined,
      };
      vedtak = [sentVedtak, ...vedtak];

      return HttpResponse.json(sentVedtak);
    }
  ),

  http.put<{ vedtakUUID: string }>(
    `${ISFRISKTILARBEID_ROOT}/frisktilarbeid/vedtak/:vedtakUUID/ferdigbehandling`,
    ({ request, params }) => {
      const vedtakUUID = params.vedtakUUID;
      const existingVedtak = vedtak.find((v) => v.uuid === vedtakUUID);
      return !!existingVedtak
        ? HttpResponse.json({
            ...existingVedtak,
            ferdigbehandletAt: dayjs(),
            ferdigbehandletBy: request.headers[NAV_PERSONIDENT_HEADER],
          })
        : HttpResponse.text(`Did not find vedtak with uuid ${vedtakUUID}`, {
            status: 400,
          });
    }
  ),
];
