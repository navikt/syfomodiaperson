import { MODIACONTEXTHOLDER_ROOT } from "@/apiConstants";
import {
  ARBEIDSTAKER_DEFAULT,
  ENHET_GAMLEOSLO,
  ENHET_GRUNERLOKKA,
  VEILEDER_IDENT_DEFAULT,
} from "../common/mockConstants";
import { http, HttpResponse } from "msw";

const saksbehandler = {
  ident: VEILEDER_IDENT_DEFAULT,
  navn: "Vetle Veileder",
  fornavn: "Vetle",
  etternavn: "Veileder",
  enheter: [
    {
      enhetId: ENHET_GRUNERLOKKA.nummer,
      navn: ENHET_GRUNERLOKKA.navn,
    },
    {
      enhetId: ENHET_GAMLEOSLO.nummer,
      navn: ENHET_GAMLEOSLO.navn,
    },
  ],
};

const aktivBruker = {
  aktivBruker: ARBEIDSTAKER_DEFAULT.personIdent,
  aktivEnhet: null,
};

const aktivEnhet = {
  aktivBruker: null,
  aktivEnhet: ENHET_GRUNERLOKKA.nummer,
};

export const mockModiacontextholder = [
  http.get(`${MODIACONTEXTHOLDER_ROOT}/decorator`, () => {
    return HttpResponse.json(saksbehandler);
  }),
  http.get(`${MODIACONTEXTHOLDER_ROOT}/context/aktivbruker`, () => {
    return HttpResponse.json(aktivBruker);
  }),
  http.get(`${MODIACONTEXTHOLDER_ROOT}/context/aktivenhet`, () => {
    return HttpResponse.json(aktivEnhet);
  }),
  http.get(`${MODIACONTEXTHOLDER_ROOT}/context/v2/aktivbruker`, () => {
    return HttpResponse.json(aktivBruker);
  }),
  http.get(`${MODIACONTEXTHOLDER_ROOT}/context/v2/aktivenhet`, () => {
    return HttpResponse.json(aktivEnhet);
  }),
  http.post(`${MODIACONTEXTHOLDER_ROOT}/context`, () => {
    return new HttpResponse(null, { status: 204 });
  }),
];
