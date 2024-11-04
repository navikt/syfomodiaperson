import {
  createDialogmote,
  createReferat,
  dialogmoterMock,
  dialogmoteStatusEndringMock,
} from "./dialogmoterMock";
import { ISDIALOGMOTE_ROOT } from "@/apiConstants";
import {
  DialogmoteDTO,
  DialogmoteStatus,
} from "@/data/dialogmote/types/dialogmoteTypes";
import dayjs from "dayjs";
import { http, HttpResponse } from "msw";

let mockedDialogmoter = dialogmoterMock;

export const mockIsdialogmote = [
  http.post(`${ISDIALOGMOTE_ROOT}/dialogmote/personident`, () => {
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

  http.get(`${ISDIALOGMOTE_ROOT}/dialogmote/personident`, () => {
    return HttpResponse.json(mockedDialogmoter);
  }),

  http.get(
    `${ISDIALOGMOTE_ROOT}/dialogmote/personident/motestatusendringer`,
    () => {
      return HttpResponse.json(dialogmoteStatusEndringMock);
    }
  ),

  http.post<{ moteuuid: string }>(
    `${ISDIALOGMOTE_ROOT}/dialogmote/:moteuuid/avlys`,
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

  http.post(`${ISDIALOGMOTE_ROOT}/dialogmote/:moteuuid/tidsted`, () => {
    return new HttpResponse(null, { status: 200 });
  }),

  http.post<{ moteuuid: string }>(
    `${ISDIALOGMOTE_ROOT}/dialogmote/:moteuuid/ferdigstill`,
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
    `${ISDIALOGMOTE_ROOT}/dialogmote/:moteuuid/endreferdigstilt`,
    () => {
      return new HttpResponse(null, { status: 200 });
    }
  ),
];
