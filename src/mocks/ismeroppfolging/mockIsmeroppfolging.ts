import { ISMEROPPFOLGING_ROOT } from "@/apiConstants";
import {
  OnskerOppfolging,
  SenOppfolgingKandidatResponseDTO,
  SenOppfolgingStatus,
  SenOppfolgingVurderingRequestDTO,
  SenOppfolgingVurderingType,
} from "@/data/senoppfolging/senOppfolgingTypes";
import { generateUUID } from "@/utils/utils";
import {
  ARBEIDSTAKER_DEFAULT,
  VEILEDER_DEFAULT,
  VEILEDER_IDENT_DEFAULT,
} from "../common/mockConstants";
import { addDays, addWeeks } from "@/utils/datoUtils";
import { http, HttpResponse } from "msw";
import {
  KandidatStatus,
  KartleggingssporsmalKandidatResponseDTO,
} from "@/data/kartleggingssporsmal/kartleggingssporsmalTypes";
import { daysFromToday } from "../../../test/testUtils";

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
  http.get(`${ISMEROPPFOLGING_ROOT}/kartleggingssporsmal/kandidater`, () => {
    return HttpResponse.json(kartleggingIsKandidatAndAnsweredQuestions);
  }),
  http.put(
    `${ISMEROPPFOLGING_ROOT}/kartleggingssporsmal/kandidater/:kandidatUUID`,
    () => {
      const svarVurdert: KartleggingssporsmalKandidatResponseDTO = {
        ...kartleggingIsKandidatAndReceivedQuestions,
        status: KandidatStatus.FERDIGBEHANDLET,
        vurdering: {
          vurdertAt: daysFromToday(5),
          vurdertBy: VEILEDER_DEFAULT.ident,
        },
      };
      return HttpResponse.json(svarVurdert);
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

export const kartleggingIsKandidatAndReceivedQuestions: KartleggingssporsmalKandidatResponseDTO =
  {
    kandidatUuid: generateUUID(),
    personident: ARBEIDSTAKER_DEFAULT.personIdent,
    varsletAt: daysFromToday(-5),
    svarAt: null,
    status: KandidatStatus.KANDIDAT,
    statusAt: daysFromToday(-5),
    vurdering: null,
  };

export const kartleggingIsKandidatAndAnsweredQuestions: KartleggingssporsmalKandidatResponseDTO =
  {
    ...kartleggingIsKandidatAndReceivedQuestions,
    status: KandidatStatus.SVAR_MOTTATT,
    svarAt: daysFromToday(0),
    vurdering: null,
  };
