import { personAdresseMock } from "./personAdresseMock";
import { SYFOPERSON_ROOT } from "@/apiConstants";
import { brukerinfoMock } from "./persondataMock";
import { http, HttpResponse } from "msw";

const isEgenAnsatt = true;

export const mockSyfoperson = [
  http.get(`${SYFOPERSON_ROOT}/person/diskresjonskode`, () => {
    return HttpResponse.text();
  }),

  http.get(`${SYFOPERSON_ROOT}/person/egenansatt`, () => {
    return HttpResponse.json(isEgenAnsatt);
  }),

  http.get(`${SYFOPERSON_ROOT}/person/adresse`, () => {
    return HttpResponse.json(personAdresseMock);
  }),

  http.get(`${SYFOPERSON_ROOT}/person/brukerinfo`, () => {
    return HttpResponse.json(brukerinfoMock);
  }),
];
