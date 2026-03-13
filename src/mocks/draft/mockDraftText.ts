import { http, HttpResponse } from "msw";
import { DraftCategory, DraftTextDTO } from "@/hooks/useDraftQuery";

function createDraftTextMock(category: DraftCategory) {
  let draft: DraftTextDTO = { begrunnelse: "" };

  return [
    http.get(`/api/draft/${category}`, () => {
      return HttpResponse.json(draft);
    }),
    http.put<object, DraftTextDTO>(
      `/api/draft/${category}`,
      async ({ request }) => {
        const body = await request.json();
        draft = { begrunnelse: body.begrunnelse };
        return new HttpResponse(JSON.stringify(draft), { status: 200 });
      }
    ),
    http.delete(`/api/draft/${category}`, () => {
      draft = { begrunnelse: "" };
      return new HttpResponse(null, { status: 200 });
    }),
  ];
}

export const mockDraftText = [
  ...createDraftTextMock("arbeidsuforhet-forhandsvarsel"),
  ...createDraftTextMock("arbeidsuforhet-avslag-uten-forhandsvarsel"),
  ...createDraftTextMock("arbeidsuforhet-oppfylt"),
  ...createDraftTextMock("manglendemedvirkning-forhandsvarsel"),
  ...createDraftTextMock("aktivitetskrav-forhandsvarsel"),
  ...createDraftTextMock("aktivitetskrav-unntak"),
  ...createDraftTextMock("aktivitetskrav-oppfylt"),
  ...createDraftTextMock("aktivitetskrav-innstilling-om-stans"),
];
