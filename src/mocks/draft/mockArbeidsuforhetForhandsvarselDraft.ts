import { http, HttpResponse } from "msw";
import { ArbeidsuforhetForhandsvarselDraftDTO } from "@/sider/arbeidsuforhet/data/arbeidsuforhetForhandsvarselDraftTypes";

let arbeidsuforhetForhandsvarselDraft: ArbeidsuforhetForhandsvarselDraftDTO = {
  begrunnelse: "",
};

export const mockArbeidsuforhetForhandsvarselDraft = [
  http.get(`/api/draft/arbeidsuforhet-forhandsvarsel`, () => {
    return HttpResponse.json(arbeidsuforhetForhandsvarselDraft);
  }),
  http.put<object, ArbeidsuforhetForhandsvarselDraftDTO>(
    `/api/draft/arbeidsuforhet-forhandsvarsel`,
    async ({ request }) => {
      const body = await request.json();
      arbeidsuforhetForhandsvarselDraft = {
        begrunnelse: body.begrunnelse,
      };
      return new HttpResponse(null, { status: 204 });
    }
  ),
  http.delete(`/api/draft/arbeidsuforhet-forhandsvarsel`, () => {
    arbeidsuforhetForhandsvarselDraft = {
      begrunnelse: "",
    };
    return new HttpResponse(null, { status: 204 });
  }),
];
