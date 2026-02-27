import { http, HttpResponse } from "msw";
import { ArbeidsuforhetForhandsvarselDraftDTO } from "@/sider/arbeidsuforhet/data/arbeidsuforhetForhandsvarselDraftTypes";

let manglendemedvirkningForhandsvarselDraft: ArbeidsuforhetForhandsvarselDraftDTO =
  {
    begrunnelse: "",
  };

export const mockManglendemedvirkningForhandsvarselDraft = [
  http.get(`/api/draft/manglendemedvirkning-forhandsvarsel`, () => {
    return HttpResponse.json(manglendemedvirkningForhandsvarselDraft);
  }),
  http.put<object, ArbeidsuforhetForhandsvarselDraftDTO>(
    `/api/draft/manglendemedvirkning-forhandsvarsel`,
    async ({ request }) => {
      const body = await request.json();
      manglendemedvirkningForhandsvarselDraft = {
        begrunnelse: body.begrunnelse,
      };
      return new HttpResponse(null, { status: 204 });
    }
  ),
  http.delete(`/api/draft/manglendemedvirkning-forhandsvarsel`, () => {
    manglendemedvirkningForhandsvarselDraft = {
      begrunnelse: "",
    };
    return new HttpResponse(null, { status: 204 });
  }),
];
