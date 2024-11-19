import dayjs from "dayjs";
import {
  ARBEIDSTAKER_DEFAULT,
  VIRKSOMHET_BRANNOGBIL,
  VIRKSOMHET_PONTYPANDY,
} from "../common/mockConstants";
import { OppfolgingsplanLPS } from "@/data/oppfolgingsplan/types/OppfolgingsplanLPS";

export const getDefaultOppfolgingsplanLPS = (
  created: Date
): OppfolgingsplanLPS => {
  return {
    uuid: "5f1e2629-062b-442d-ae1f-3b08e9574cd2",
    fnr: ARBEIDSTAKER_DEFAULT.personIdent,
    virksomhetsnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
    opprettet: dayjs(created).subtract(1, "days").toJSON(),
    sistEndret: dayjs(created).subtract(1, "days").toJSON(),
  };
};

export const oppfolgingsplanerLPSMock = (
  created: Date
): OppfolgingsplanLPS[] => {
  return [
    getDefaultOppfolgingsplanLPS(created),
    {
      ...getDefaultOppfolgingsplanLPS(created),
      uuid: "5f1e2629-062b-442d-ae1f-3b08e9574cd3",
      virksomhetsnummer: VIRKSOMHET_BRANNOGBIL.virksomhetsnummer,
      opprettet: dayjs(created).subtract(10, "days").toJSON(),
      sistEndret: dayjs(created).subtract(10, "days").toJSON(),
    },
    {
      ...getDefaultOppfolgingsplanLPS(created),
      uuid: "5f1e2629-062b-442d-ae1f-3b08e9574cd9",
      virksomhetsnummer: VIRKSOMHET_BRANNOGBIL.virksomhetsnummer,
      opprettet: dayjs(created).subtract(11, "days").toJSON(),
      sistEndret: dayjs(created).subtract(11, "days").toJSON(),
    },
    {
      ...getDefaultOppfolgingsplanLPS(created),
      uuid: "5f1e2629-062b-442d-ae1f-3b08e9574cd4",
      opprettet: dayjs(new Date("2020-06-06")).toJSON(),
      sistEndret: dayjs(new Date("2020-06-06")).toJSON(),
    },
  ];
};
