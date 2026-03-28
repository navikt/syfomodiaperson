import {
  createDialogmote,
  createReferat,
  dialogmoterMock,
  dialogmoteStatusEndringMock,
} from "./dialogmoterMock";
import { ISDIALOGMOTE_ROOT, ISDIALOGMOTE_ROOT_V2 } from "@/apiConstants";
import {
  DialogmoteDTO,
  DialogmoteStatus,
} from "@/sider/dialogmoter/types/dialogmoteTypes";
import dayjs from "dayjs";
import { http, HttpResponse } from "msw";
import { VEILEDER_IDENT_DEFAULT } from "@/mocks/common/mockConstants";

let mockedDialogmoter = dialogmoterMock;

let avventMock: {
  frist: string;
  createdBy: string;
  beskrivelse: string | null;
}[] = [];

export const mockIsdialogmote = [
  http.post(`${ISDIALOGMOTE_ROOT_V2}/dialogmote/personident`, () => {
    mockedDialogmoter = [
      ...mockedDialogmoter,
      createDialogmote(
        "0",
        DialogmoteStatus.INNKALT,
        dayjs().add(10, "days").toDate()
      ),
    ];
    return new HttpResponse(null, { status: 200 });
  }),

  http.get(`${ISDIALOGMOTE_ROOT_V2}/dialogmote/personident`, () => {
    return HttpResponse.json([]);
  }),

  http.get(
    `${ISDIALOGMOTE_ROOT_V2}/dialogmote/personident/motestatusendringer`,
    () => {
      return HttpResponse.json(dialogmoteStatusEndringMock);
    }
  ),

  http.post<{ moteuuid: string }>(
    `${ISDIALOGMOTE_ROOT_V2}/dialogmote/:moteuuid/avlys`,
    ({ params }) => {
      const { moteuuid } = params;
      const dialogmoteToUpdate: DialogmoteDTO | undefined =
        mockedDialogmoter.find((dialogmote) => dialogmote.uuid === moteuuid);
      if (!!dialogmoteToUpdate) {
        const filteredDialogmoter = mockedDialogmoter.filter(
          (dm) => dm.uuid !== dialogmoteToUpdate.uuid
        );
        mockedDialogmoter = [
          ...filteredDialogmoter,
          {
            ...dialogmoteToUpdate,
            status: DialogmoteStatus.AVLYST,
          },
        ];
        return new HttpResponse(null, { status: 200 });
      } else {
        return new HttpResponse(null, { status: 500 });
      }
    }
  ),

  http.post(`${ISDIALOGMOTE_ROOT_V2}/dialogmote/:moteuuid/tidsted`, () => {
    return new HttpResponse(null, { status: 200 });
  }),

  http.post<{ moteuuid: string }>(
    `${ISDIALOGMOTE_ROOT_V2}/dialogmote/:moteuuid/ferdigstill`,
    ({ params }) => {
      const { moteuuid } = params;
      const dialogmoteToUpdate: DialogmoteDTO | undefined =
        mockedDialogmoter.find((dialogmote) => dialogmote.uuid === moteuuid);
      if (!!dialogmoteToUpdate) {
        const filteredDialogmoter = mockedDialogmoter.filter(
          (dm) => dm.uuid !== dialogmoteToUpdate.uuid
        );
        mockedDialogmoter = [
          ...filteredDialogmoter,
          {
            ...dialogmoteToUpdate,
            status: DialogmoteStatus.FERDIGSTILT,
            referatList: [createReferat(true, Date.now().toString())],
          },
        ];
        return new HttpResponse(null, { status: 200 });
      } else {
        return new HttpResponse(null, { status: 500 });
      }
    }
  ),

  http.post(
    `${ISDIALOGMOTE_ROOT_V2}/dialogmote/:moteuuid/endreferdigstilt`,
    () => {
      return new HttpResponse(null, { status: 200 });
    }
  ),

  http.post(`${ISDIALOGMOTE_ROOT}/avvent`, async ({ request }) => {
    const body = (await request.json()) as {
      personIdent: string;
      frist: string;
      beskrivelse?: string;
    };

    const nyAvvent = {
      frist: body.frist,
      createdBy: VEILEDER_IDENT_DEFAULT,
      beskrivelse: body.beskrivelse ?? null,
    };

    avventMock = [nyAvvent, ...avventMock];

    return HttpResponse.json(nyAvvent, { status: 200 });
  }),

  http.post(`${ISDIALOGMOTE_ROOT}/avvent/query`, () => {
    return HttpResponse.json(avventMock);
  }),
];
