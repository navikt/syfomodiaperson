import { http, HttpResponse } from "msw";
import { SYFOPERSON_ROOT } from "@/apiConstants";
import { TiltakDTO, TiltakResponseDTO } from "@/data/tiltak/tiltakTypes";

/**
 * Lager et aktivt tiltak til bruk i mocks og tester.
 */
export function createTiltakMock(tiltak: Partial<TiltakDTO> = {}): TiltakDTO {
  return {
    id: "6f1c7c1e-3f0a-4d0a-9d3e-1b2c3d4e5f60",
    tittel: "Oppfølging hos Arrangør AS",
    tiltakskode: "OPPFOLGING",
    tiltakstypeNavn: "Oppfølging",
    startDato: "2026-10-01",
    sluttDato: "2027-01-31",
    ...tiltak,
  };
}

export const mockTiltakResponse: TiltakResponseDTO = {
  tiltak: [
    createTiltakMock(),
    createTiltakMock({
      id: "0a9b8c7d-6e5f-4a3b-2c1d-0e9f8a7b6c5d",
      tittel: "Arbeidstrening hos Bedrift AS",
      tiltakskode: "ARBEIDSTRENING",
      tiltakstypeNavn: "Arbeidstrening",
      sluttDato: null,
    }),
  ],
};

export const mockTiltak = http.post(
  `${SYFOPERSON_ROOT}/person/tiltak/query`,
  () => {
    return HttpResponse.json(mockTiltakResponse);
  },
);
