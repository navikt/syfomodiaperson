import { http, HttpResponse } from "msw";
import { ArbeidsuforhetForhandsvarselDraftDTO } from "@/sider/arbeidsuforhet/data/arbeidsuforhetForhandsvarselDraftTypes";

let arbeidsuforhetAvslagUtenForhandsvarselDraft: ArbeidsuforhetForhandsvarselDraftDTO =
  {
    begrunnelse: "",
  };

export const mockArbeidsuforhetAvslagUtenForhandsvarselDraft = [
  http.get(`/api/draft/arbeidsuforhet-avslag-uten-forhandsvarsel`, () => {
    return HttpResponse.json(arbeidsuforhetAvslagUtenForhandsvarselDraft);
  }),
  http.put<object, ArbeidsuforhetForhandsvarselDraftDTO>(
    `/api/draft/arbeidsuforhet-avslag-uten-forhandsvarsel`,
    async ({ request }) => {
      const body = await request.json();
      arbeidsuforhetAvslagUtenForhandsvarselDraft = {
        begrunnelse: body.begrunnelse,
      };
      return new HttpResponse(null, { status: 204 });
    }
  ),
  http.delete(`/api/draft/arbeidsuforhet-avslag-uten-forhandsvarsel`, () => {
    arbeidsuforhetAvslagUtenForhandsvarselDraft = {
      begrunnelse: "",
    };
    return new HttpResponse(null, { status: 204 });
  }),
];
