import { ISMEROPPFOLGING_ROOT } from "@/apiConstants";
import {
  OnskerOppfolging,
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
import { addDays, addWeeks } from "@/utils/datoUtils";
import { http, HttpResponse } from "msw";

export const mockIsmeroppfolging = [
  http.get(`${ISMEROPPFOLGING_ROOT}/senoppfolging/kandidater`, () => {
    return HttpResponse.json([
      senOppfolgingKandidatMock,
      ferdigbehandletKandidatMock,
    ]);
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
  varselAt: new Date(),
  svar: {
    svarAt: addDays(new Date(), 3),
    onskerOppfolging: OnskerOppfolging.JA,
  },
  vurderinger: [],
};

export const ferdigbehandletKandidatMock: SenOppfolgingKandidatResponseDTO = {
  ...senOppfolgingKandidatMock,
  createdAt: addWeeks(new Date(), -60),
  varselAt: addWeeks(new Date(), -60),
  svar: {
    svarAt: addWeeks(new Date(), -59),
    onskerOppfolging: OnskerOppfolging.JA,
  },
  status: SenOppfolgingStatus.FERDIGBEHANDLET,
  vurderinger: [
    {
      uuid: generateUUID(),
      createdAt: addWeeks(new Date(), -58),
      type: SenOppfolgingVurderingType.FERDIGBEHANDLET,
      veilederident: VEILEDER_IDENT_DEFAULT,
    },
  ],
};
