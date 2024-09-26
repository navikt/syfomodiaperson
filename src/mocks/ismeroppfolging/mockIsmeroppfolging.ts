import { ISMEROPPFOLGING_ROOT } from "@/apiConstants";
import {
  SenOppfolgingKandidatResponseDTO,
  SenOppfolgingStatus,
  SenOppfolgingVurderingRequestDTO,
  SenOppfolgingVurderingType,
} from "@/data/senoppfolging/senOppfolgingTypes";
import { generateUUID } from "@/utils/uuidUtils";
import {
  ARBEIDSTAKER_DEFAULT,
  VEILEDER_IDENT_DEFAULT,
} from "../common/mockConstants";
import { addWeeks } from "@/utils/datoUtils";
import { http, HttpResponse } from "msw";

export const mockIsmeroppfolging = [
  http.get(`${ISMEROPPFOLGING_ROOT}/senoppfolging/kandidater`, () => {
    return HttpResponse.json([senOppfolgingKandidatMock]);
  }),
  http.post<object, SenOppfolgingVurderingRequestDTO>(
    `${ISMEROPPFOLGING_ROOT}/senoppfolging/kandidater/:kandidatUUID/vurderinger`,
    async ({ request }) => {
      const body = await request.json();
      const vurdering: SenOppfolgingKandidatResponseDTO = {
        ...senOppfolgingKandidatMock,
        createdAt: addWeeks(new Date(), -60),
        status: SenOppfolgingStatus.FERDIGBEHANDLET,
        vurderinger: [
          {
            uuid: generateUUID(),
            createdAt: addWeeks(new Date(), -50),
            type: SenOppfolgingVurderingType.FERDIGBEHANDLET,
            veilederident: VEILEDER_IDENT_DEFAULT,
            begrunnelse: body.begrunnelse,
          },
        ],
      };

      return HttpResponse.json(vurdering);
    }
  ),
];

export const senOppfolgingKandidatMock: SenOppfolgingKandidatResponseDTO = {
  uuid: generateUUID(),
  createdAt: new Date(),
  personident: ARBEIDSTAKER_DEFAULT.personIdent,
  status: SenOppfolgingStatus.KANDIDAT,
  vurderinger: [],
};

export const ferdigbehandletKandidatMock: SenOppfolgingKandidatResponseDTO = {
  ...senOppfolgingKandidatMock,
  createdAt: addWeeks(new Date(), -60),
  status: SenOppfolgingStatus.FERDIGBEHANDLET,
  vurderinger: [
    {
      uuid: generateUUID(),
      createdAt: addWeeks(new Date(), -50),
      type: SenOppfolgingVurderingType.FERDIGBEHANDLET,
      veilederident: VEILEDER_IDENT_DEFAULT,
    },
  ],
};
