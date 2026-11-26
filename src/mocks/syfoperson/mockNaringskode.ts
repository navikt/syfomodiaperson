import { http, HttpResponse } from "msw";
import { SYFOPERSON_ROOT } from "@/apiConstants";
import {
  Naringskode,
  NaringskodeStandard,
} from "@/data/virksomhet/Naringskode";

const naringskoder1994: Record<string, Naringskode[]> = {
  "01.410": [
    {
      code: "01.410",
      name: "Tjenester tilknyttet planteproduksjon",
      parentCode: "01.41",
      shortName: "Tjenester tilkn. planteproduksjon",
    },
    {
      code: "01.41",
      name: "Tjenester tilknyttet planteproduksjon",
      parentCode: "01.4",
      shortName: "Tjenester tilkn. planteproduksjon",
    },
    {
      code: "01.4",
      name: "Tjenester tilknyttet jordbruk",
      parentCode: "01",
      shortName: "Tjenester tilknyttet jordbruk",
    },
    {
      code: "01",
      name: "Jordbruk og tjenester tilknyttet jordbruk. jakt og viltstell",
      parentCode: "A_",
      shortName: "Jordbruk, jakt og viltstell",
    },
    {
      code: "A_",
      name: "Jordbruk og skogbruk",
      parentCode: "A",
      shortName: "Jordbruk og skogbruk",
    },
    {
      code: "A",
      name: "Jordbruk og skogbruk",
      parentCode: null,
      shortName: "Jordbruk og skogbruk",
    },
  ],
};
const naringskoder2002: Record<string, Naringskode[]> = {
  "71.330": [
    {
      code: "71.330",
      name: "Utleie av kontor- og datamaskiner",
      parentCode: "71.33",
      shortName: "Utleie av kontor- og datamaskiner",
    },
    {
      code: "71.33",
      name: "Utleie av kontor- og datamaskiner",
      parentCode: "71.3",
      shortName: "Utleie av kontor- og datamaskiner",
    },
    {
      code: "71.3",
      name: "Utleie av andre maskiner og annet utstyr",
      parentCode: "71",
      shortName: "Utleie av andre maskiner og  utstyr",
    },
    {
      code: "71",
      name: "Utleie av maskiner og utstyr uten personell. Utleie av husholdningsvarer og varer til personlig bruk",
      parentCode: "K_",
      shortName: "Utleievirksomhet, mask. og utstyr",
    },
    {
      code: "K_",
      name: "Eiendomsdrift, utleievirksomhet og forretningsmessig tjenesteyting",
      parentCode: "K",
      shortName: "Forr.tjenesteyting og eiendomsdrift",
    },
    {
      code: "K",
      name: "Eiendomsdrift, utleievirksomhet og forretningsmessig tjenesteyting",
      parentCode: null,
      shortName: "Forr.tjenesteyting, eiendomsdrift",
    },
  ],
};

const naringskoder2007: Record<string, Naringskode[]> = {
  "62.020": [
    {
      code: "62.020",
      name: "Konsulentvirksomhet tilknyttet informasjonsteknologi",
      parentCode: "62.02",
      shortName: "Kons.virks. tilkn. informasj.tekn.",
    },
    {
      code: "62.02",
      name: "Konsulentvirksomhet tilknyttet informasjonsteknologi",
      parentCode: "62.0",
      shortName: "Kons.virks. tilkn. informasj.tekn.",
    },
    {
      code: "62.0",
      name: "Tjenester tilknyttet informasjonsteknologi",
      parentCode: "62",
      shortName: "Tjen. tilkn. informasjonsteknologi",
    },
    {
      code: "62",
      name: "Tjenester tilknyttet informasjonsteknologi",
      parentCode: "J",
      shortName: "IT-tjenester",
    },
    {
      code: "J",
      name: "Informasjon og kommunikasjon",
      parentCode: null,
      shortName: "Informasjon og kommunikasjon",
    },
  ],
  "70.220": [
    {
      code: "70.220",
      name: "Bedriftsrådgivning og annen administrativ rådgivning",
      parentCode: "70.22",
      shortName: "Bedriftsrådgiv./annen adm. rådgiv.",
    },
    {
      code: "70.22",
      name: "Bedriftsrådgivning og annen administrativ rådgivning",
      parentCode: "70.2",
      shortName: "Bedriftsrådgiv./annen adm. rådgiv.",
    },
    {
      code: "70.2",
      name: "Administrativ rådgivning",
      parentCode: "70",
      shortName: "Administrativ rådgivning",
    },
    {
      code: "70",
      name: "Hovedkontortjenester, administrativ rådgivning",
      parentCode: "M",
      shortName: "Hovedkontortjen. og adm. rådgivning",
    },
    {
      code: "M",
      name: "Faglig, vitenskapelig og teknisk tjenesteyting",
      parentCode: null,
      shortName: "Faglig, vit. og tekn. tjenesteyting",
    },
  ],
};

const naringskoder2025: Record<string, Naringskode[]> = {
  "62.200": [
    {
      code: "62.200",
      name: "Konsulentvirksomhet tilknyttet informasjonsteknologi og forvaltning og drift av IT-systemer",
      parentCode: "62.20",
      shortName: "Kons.virks. tilkn. IT, drift av IT-systemer mv.",
    },
    {
      code: "62.20",
      name: "Konsulentvirksomhet tilknyttet informasjonsteknologi og forvaltning og drift av IT-systemer",
      parentCode: "62.2",
      shortName: "Kons.virks. tilkn. IT, drift av IT-systemer mv.",
    },
    {
      code: "62.2",
      name: "Konsulentvirksomhet tilknyttet informasjonsteknologi og forvaltning og drift av IT-systemer",
      parentCode: "62",
      shortName: "Kons.virks. tilkn. IT, drift av IT-systemer mv.",
    },
    {
      code: "62",
      name: "Dataprogrammering, konsulentvirksomhet og andre tjenester tilknyttet informasjonsteknologi",
      parentCode: "K",
      shortName: "IT-tjenester",
    },
    {
      code: "K",
      name: "Telekommunikasjon, dataprogrammering, konsulentvirksomhet, datainfrastruktur og andre tjenester tilknyttet informasjonsteknologi",
      parentCode: null,
      shortName: "IKT-virksomhet",
    },
  ],
  "70.200": [
    {
      code: "70.200",
      name: "Bedriftsrådgivning og annen administrativ rådgivning",
      parentCode: "70.20",
      shortName: "Bedriftsrådgivning og annen adm. rådgivning",
    },
    {
      code: "70.20",
      name: "Bedriftsrådgivning og annen administrativ rådgivning",
      parentCode: "70.2",
      shortName: "Bedriftsrådgivning og annen adm. rådgivning",
    },
    {
      code: "70.2",
      name: "Bedriftsrådgivning og annen administrativ rådgivning",
      parentCode: "70",
      shortName: "Bedriftsrådgivning og annen adm. rådgivning",
    },
    {
      code: "70",
      name: "Hovedkontortjenester og administrativ rådgivning",
      parentCode: "N",
      shortName: "Hovedkontortjen. og adm. rådgivning",
    },
    {
      code: "N",
      name: "Faglig, vitenskapelig og teknisk tjenesteyting",
      parentCode: null,
      shortName: "Faglig, vitenskap., teknisk tjenesteyting",
    },
  ],
};

const naringskoder: Record<
  NaringskodeStandard,
  Record<string, Naringskode[]>
> = {
  "1994": naringskoder1994,
  "2002": naringskoder2002,
  "2007": naringskoder2007,
  "2025": naringskoder2025,
};

export const mockNaringskode = http.get<{ kode: string }>(
  `*${SYFOPERSON_ROOT}/naringskode/:kode`,
  ({ params, request }) => {
    const standardParam = new URL(request.url).searchParams.get("standard");
    const standard = Number(standardParam);

    if (
      standard !== 1994 &&
      standard !== 2002 &&
      standard !== 2007 &&
      standard !== 2025
    ) {
      return new HttpResponse(null, { status: 400 });
    }

    const codes = Object.values(naringskoder[standard]).find((hierarki) =>
      hierarki.some(({ code }) => code === params.kode),
    );
    if (!codes) {
      return new HttpResponse(null, { status: 404 });
    }

    const index = codes.findIndex(({ code }) => code === params.kode);
    return HttpResponse.json({
      standard: standard,
      hierarki: codes.slice(index),
    });
  },
);
