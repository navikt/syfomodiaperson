import { ISUTENLANDSOPPHOLD_ROOT } from "@/apiConstants";
import {
  SoknadDTO,
  SoknaderResponseDTO,
  SoknadStatusDTO,
  SoknadVedtakPostDTO,
  SoknadVedtakResponseDTO,
} from "@/data/utenlandsopphold/utenlandsoppholdTypes";
import { http, HttpResponse } from "msw";
import dayjs from "dayjs";
import { VEILEDER_IDENT_DEFAULT } from "@/mocks/common/mockConstants.ts";

export const soknadUtenVedtakMock: SoknadDTO = {
  soknadId: "1a2b3c4d-5e6f-7890-abcd-ef0987654321",
  eksternId: "e16ff778-8475-47e1-b5dc-d2ce4ad6b9ee",
  status: SoknadStatusDTO.MOTTATT,
  innsendtTidspunkt: "2026-08-18T11:00:00",
  soktePerioder: [
    {
      fom: "2026-09-01",
      tom: "2026-09-07",
    },
    {
      fom: "2026-09-10",
      tom: "2026-09-12",
    },
  ],
  vedtak: null,
};

export const soknadMedVedtakMock: SoknadDTO = {
  soknadId: "9b1c2d3e-4f56-7890-abcd-ef1234567890",
  eksternId: "1735b402-f937-4958-8aa2-fe36aef70826",
  status: SoknadStatusDTO.INNVILGET,
  innsendtTidspunkt: "2026-08-05T09:00:00",
  soktePerioder: [
    {
      fom: "2026-08-01",
      tom: "2026-08-10",
    },
  ],
  vedtak: {
    utfall: "DELVIS_INNVILGET",
    innvilgedePerioder: [
      {
        fom: "2026-08-01",
        tom: "2026-08-05",
      },
    ],
    fattetAv: "Z990000",
    fattetTidspunkt: "2026-03-02T11:00:00",
    begrunnelse: "Vedtar bare de dagene det er meldt regn på Bali",
  },
};

export const gammelSoknadMock: SoknadDTO = {
  soknadId: "3c4d5e6f-7a8b-9012-cdef-345678901234",
  eksternId: "b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e",
  status: SoknadStatusDTO.MOTTATT,
  innsendtTidspunkt: "2026-05-15T08:30:00",
  soktePerioder: [
    {
      fom: "2026-06-01",
      tom: "2026-06-07",
    },
    {
      fom: "2026-06-10",
      tom: "2026-06-12",
    },
  ],
  vedtak: null,
};

export const mockSoknaderResponse: SoknaderResponseDTO = {
  soknader: [soknadUtenVedtakMock, gammelSoknadMock, soknadMedVedtakMock],
};

/**
 * Bygger en oppdatert søknad basert på et innsendt vedtak, slik backend ville
 * gjort det. Delt mellom msw-handleren under (brukt lokalt i dev) og
 * test-stubben i test/stubs/stubIsutenlandsopphold.ts, slik at begge
 * simulerer samme oppførsel når et vedtak fattes.
 */
export function byggOppdatertSoknadMedVedtak(
  soknad: SoknadDTO,
  vedtak: SoknadVedtakPostDTO,
  fattetAv: string,
): SoknadDTO {
  return {
    ...soknad,
    status:
      vedtak.utfall === "INNVILGET"
        ? SoknadStatusDTO.INNVILGET
        : vedtak.utfall === "DELVIS_INNVILGET"
          ? SoknadStatusDTO.DELVIS_INNVILGET
          : vedtak.utfall === "HENLAGT"
            ? SoknadStatusDTO.HENLAGT
            : SoknadStatusDTO.AVSLAG,
    vedtak: {
      utfall: vedtak.utfall,
      innvilgedePerioder: vedtak.innvilgedePerioder,
      fattetAv,
      fattetTidspunkt: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
      begrunnelse: vedtak.begrunnelse,
    },
  };
}

export const mockIsutenlandsopphold = [
  http.post(`${ISUTENLANDSOPPHOLD_ROOT}/soknader/query`, () => {
    return HttpResponse.json(mockSoknaderResponse);
  }),

  http.post<
    { soknadId: string },
    SoknadVedtakPostDTO,
    SoknadVedtakResponseDTO | string
  >(
    `${ISUTENLANDSOPPHOLD_ROOT}/soknader/:soknadId/vedtak`,
    async ({ request, params }) => {
      const body = await request.json();
      const soknadId = params.soknadId;

      const existingSoknad = mockSoknaderResponse.soknader.find(
        (soknad) => soknad.soknadId === soknadId,
      );

      return existingSoknad
        ? HttpResponse.json({
            soknad: byggOppdatertSoknadMedVedtak(
              existingSoknad,
              body,
              VEILEDER_IDENT_DEFAULT,
            ),
          })
        : HttpResponse.text(`Did not find soknad with uuid ${soknadId}`, {
            status: 400,
          });
    },
  ),
];
