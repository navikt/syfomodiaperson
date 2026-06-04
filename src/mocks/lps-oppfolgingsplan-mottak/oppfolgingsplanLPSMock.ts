import dayjs from "dayjs";
import {
  ARBEIDSTAKER_DEFAULT,
  VIRKSOMHET_BRANNOGBIL,
  VIRKSOMHET_PONTYPANDY,
} from "../common/mockConstants";
import { OppfolgingsplanLPS } from "@/sider/oppfolgingsplan/hooks/types/OppfolgingsplanLPS";

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

// Oppfølgingstilfeller i mock:
// Tilfelle 1: 2019-06-06 → 2020-01-21 (Pontypandy)
// Tilfelle 2: 2020-02-21 → 2020-12-10 (Pontypandy)
// Current tilfelle: ~40 uker siden → ~20 uker frem (Pontypandy + BrannOgBil)
export const oppfolgingsplanerLPSMock = (
  created: Date
): OppfolgingsplanLPS[] => {
  return [
    // Current tilfelle — Pontypandy (1 dag siden)
    getDefaultOppfolgingsplanLPS(created),
    // Current tilfelle — BrannOgBil (10 dager siden)
    {
      ...getDefaultOppfolgingsplanLPS(created),
      uuid: "5f1e2629-062b-442d-ae1f-3b08e9574cd3",
      virksomhetsnummer: VIRKSOMHET_BRANNOGBIL.virksomhetsnummer,
      opprettet: dayjs(created).subtract(10, "days").toJSON(),
      sistEndret: dayjs(created).subtract(10, "days").toJSON(),
    },
    // Tilfelle 2 (opprettet 2020-06-06, innenfor 2020-02-21 → 2020-12-10)
    {
      ...getDefaultOppfolgingsplanLPS(created),
      uuid: "5f1e2629-062b-442d-ae1f-3b08e9574cd4",
      opprettet: dayjs(new Date("2020-06-06")).toJSON(),
      sistEndret: dayjs(new Date("2020-06-06")).toJSON(),
    },
  ];
};
