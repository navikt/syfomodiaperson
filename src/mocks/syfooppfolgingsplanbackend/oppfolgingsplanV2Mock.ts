import { OppfolgingsplanV2DTO } from "@/sider/oppfolgingsplan/hooks/types/OppfolgingsplanV2DTO";
import {
  ARBEIDSTAKER_DEFAULT,
  VIRKSOMHET_PONTYPANDY,
} from "../common/mockConstants";

export const oppfolgingsplanV2Mock: OppfolgingsplanV2DTO[] = [
  {
    uuid: "3abbad77-1206-4432-b2f5-953566e5e9a1",
    fnr: ARBEIDSTAKER_DEFAULT.personIdent,
    deltMedNavTidspunkt: "2025-12-09T22:34:18.220926Z",
    virksomhetsnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
    opprettet: "2025-12-09T22:34:15.513094Z",
    sistEndret: "2025-12-09T22:34:18.220926Z",
    evalueringsdato: "2025-12-13",
  },
  {
    uuid: "ac8735fe-25ba-4af8-a4f6-64e35a6d6060",
    fnr: ARBEIDSTAKER_DEFAULT.personIdent,
    deltMedNavTidspunkt: "2025-12-09T12:36:38.858661Z",
    virksomhetsnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
    opprettet: "2025-12-09T12:13:34.439101Z",
    sistEndret: "2025-12-09T12:36:38.858661Z",
    evalueringsdato: "2025-12-13",
  },
  {
    uuid: "774b3632-0e35-4d8d-b71f-10c99ab7ecfa",
    fnr: ARBEIDSTAKER_DEFAULT.personIdent,
    deltMedNavTidspunkt: "2025-12-08T13:07:34.290978Z",
    virksomhetsnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
    opprettet: "2025-12-08T13:07:30.739504Z",
    sistEndret: "2025-12-08T13:07:34.290978Z",
    evalueringsdato: "2025-12-10",
  },
  {
    uuid: "5e66692c-c9c8-48f1-a076-6851482fa4a1",
    fnr: ARBEIDSTAKER_DEFAULT.personIdent,
    deltMedNavTidspunkt: "2025-12-08T11:39:50.167986Z",
    virksomhetsnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
    opprettet: "2025-12-08T11:36:59.054024Z",
    sistEndret: "2025-12-08T11:39:50.167986Z",
    evalueringsdato: "2025-12-17",
  },
  {
    uuid: "2ff96ace-be43-4dc0-a837-fd55380a8a01",
    fnr: ARBEIDSTAKER_DEFAULT.personIdent,
    deltMedNavTidspunkt: "2025-12-05T12:58:44.373593Z",
    virksomhetsnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
    opprettet: "2025-12-05T12:58:27.281792Z",
    sistEndret: "2025-12-05T12:58:44.373593Z",
    evalueringsdato: "2025-12-10",
  },
];
