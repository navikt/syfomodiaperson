import { ISBEHANDLERDIALOG_ROOT } from "@/apiConstants";
import { behandlerdialogMock, defaultMelding } from "./behandlerdialogMock";
import { MeldingTilBehandlerDTO } from "@/data/behandlerdialog/behandlerdialogTypes";
import { http, HttpResponse } from "msw";

let behandlerdialogMockData = behandlerdialogMock;

const replaceNumberInString = (originalString: string, searchValue: string) => {
  const replaceValue = Math.round(Math.random() * 10).toString();

  return originalString.replace(
    searchValue,
    replaceValue !== searchValue
      ? replaceValue
      : Math.round(Math.random() * 10).toString()
  );
};

export const mockIsbehandlerdialog = [
  http.get(`${ISBEHANDLERDIALOG_ROOT}/melding`, () => {
    return HttpResponse.json(behandlerdialogMock);
  }),
  http.get(`${ISBEHANDLERDIALOG_ROOT}/melding/:uuid/:vedleggNumber/pdf`, () => {
    return HttpResponse.text("PDF");
  }),
  http.post<object, MeldingTilBehandlerDTO>(
    `${ISBEHANDLERDIALOG_ROOT}/melding`,
    async ({ request }) => {
      const body = await request.json();
      behandlerdialogMockData = {
        conversations: {
          ...behandlerdialogMockData.conversations,
          [`${body.tekst}`]: [
            {
              ...defaultMelding,
              uuid: replaceNumberInString(defaultMelding.uuid, "5"),
              type: body.type,
              tekst: body.tekst,
              tidspunkt: new Date(),
            },
          ],
        },
      };
      return new HttpResponse(null, { status: 200 });
    }
  ),
  http.post(`${ISBEHANDLERDIALOG_ROOT}/melding/:uuid/paminnelse`, () => {
    return new HttpResponse(null, { status: 200 });
  }),
  http.post(`${ISBEHANDLERDIALOG_ROOT}/melding/:uuid/retur`, () => {
    return new HttpResponse(null, { status: 200 });
  }),
];
