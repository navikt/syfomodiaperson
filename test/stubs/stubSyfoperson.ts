import { SYFOPERSON_ROOT } from "@/apiConstants";
import { personAdresseMock } from "@/mocks/syfoperson/personAdresseMock";
import { brukerinfoMock } from "@/mocks/syfoperson/persondataMock";
import { mockServer } from "../setup";
import { http, HttpResponse } from "msw";

export const stubEgenansattApi = (isEgenansatt: boolean) =>
  mockServer.use(
    http.get(`*${SYFOPERSON_ROOT}/person/egenansatt`, () =>
      HttpResponse.json(isEgenansatt)
    )
  );

export const stubDiskresjonskodeApi = (diskresjonskode = "") =>
  mockServer.use(
    http.get(`*${SYFOPERSON_ROOT}/person/diskresjonskode`, () =>
      HttpResponse.json(diskresjonskode)
    )
  );

export const stubPersonadresseApi = () =>
  mockServer.use(
    http.get(`*${SYFOPERSON_ROOT}/person/adresse`, () =>
      HttpResponse.json(personAdresseMock)
    )
  );

interface TilrettelagtKommunikasjon {
  talesprakTolk: { value: string | null } | null;
  tegnsprakTolk: { value: string | null } | null;
}

export const stubPersoninfoApi = (
  dodsdato?: string,
  tilrettelagtKommunikasjon?: TilrettelagtKommunikasjon
) => {
  const brukerinfo = {
    ...brukerinfoMock,
    dodsdato: dodsdato || null,
    tilrettelagtKommunikasjon: tilrettelagtKommunikasjon || null,
  };
  mockServer.use(
    http.get(`*${SYFOPERSON_ROOT}/person/brukerinfo`, () =>
      HttpResponse.json(brukerinfo)
    )
  );
};
