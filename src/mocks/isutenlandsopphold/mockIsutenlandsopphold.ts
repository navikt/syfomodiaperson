import { ISUTENLANDSOPPHOLD_ROOT } from "@/apiConstants";
import {
  SoknadDTO,
  SoknaderResponseDTO,
  SoknadStatusDTO,
} from "@/data/utenlandsopphold/utenlandsoppholdTypes";
import { http, HttpResponse } from "msw";

export const soknadUtenVedtakMock: SoknadDTO = {
  soknadId: "1a2b3c4d-5e6f-7890-abcd-ef0987654321",
  eksternId: "e16ff778-8475-47e1-b5dc-d2ce4ad6b9ee",
  status: SoknadStatusDTO.MOTTATT,
  innsendtTidspunkt: "2026-05-15T08:30:00Z",
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

export const soknadMedVedtakMock: SoknadDTO = {
  soknadId: "9b1c2d3e-4f56-7890-abcd-ef1234567890",
  eksternId: "1735b402-f937-4958-8aa2-fe36aef70826",
  status: SoknadStatusDTO.INNVILGET,
  innsendtTidspunkt: "2026-03-01T09:00:00Z",
  soktePerioder: [
    {
      fom: "2026-04-01",
      tom: "2026-04-10",
    },
  ],
  vedtak: {
    utfall: "INNVILGET",
    innvilgetePerioder: [
      {
        fom: "2026-04-01",
        tom: "2026-04-05",
      },
    ],
    fattetAv: "Z990000",
    fattetTidspunkt: "2026-03-02T11:00:00Z",
  },
};

export const mockSoknaderResponse: SoknaderResponseDTO = {
  soknader: [soknadUtenVedtakMock, soknadMedVedtakMock],
};

export const mockIsutenlandsopphold = [
  http.post(`${ISUTENLANDSOPPHOLD_ROOT}/soknader/query`, () => {
    return HttpResponse.json(mockSoknaderResponse);
  }),
];
