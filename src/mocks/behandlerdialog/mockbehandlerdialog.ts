import { http, HttpResponse } from "msw";
import { MeldingTilBehandlerDraftDTO } from "@/data/behandlerdialog/meldingtilbehandlerDraftTypes";

let draft: MeldingTilBehandlerDraftDTO = {
  tekst: "",
  meldingType: undefined,
  behandlerRef: undefined,
};

export const mockBehandlerdialog = [
  http.get(`/api/draft/behandlerdialog-meldingtilbehandler`, () => {
    return HttpResponse.json(draft);
  }),
  http.put<object, MeldingTilBehandlerDraftDTO>(
    `/api/draft/behandlerdialog-meldingtilbehandler`,
    async ({ request }) => {
      const body = await request.json();
      draft = {
        tekst: body.tekst,
        meldingType: body.meldingType,
        behandlerRef: body.behandlerRef,
      };
      return new HttpResponse(null, { status: 200 });
    }
  ),
  http.delete(`/api/draft/behandlerdialog-meldingtilbehandler`, () => {
    draft = {
      tekst: "",
      meldingType: undefined,
      behandlerRef: undefined,
    };
    return new HttpResponse(null, { status: 200 });
  }),
];
