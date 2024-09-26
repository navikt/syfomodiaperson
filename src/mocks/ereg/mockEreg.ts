import { virksomhetMock } from "./virksomhetMock";
import { http, HttpResponse } from "msw";

const mockEreg = http.get<{
  virksomhetsnummer: string;
}>("/ereg/api/v1/organisasjon/:virksomhetsnummer", ({ params }) => {
  const { virksomhetsnummer } = params;
  return HttpResponse.json(virksomhetMock(virksomhetsnummer));
});

export default mockEreg;
