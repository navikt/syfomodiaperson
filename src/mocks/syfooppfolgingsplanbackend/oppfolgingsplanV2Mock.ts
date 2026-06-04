import { OppfolgingsplanV2DTO } from "@/sider/oppfolgingsplan/hooks/types/OppfolgingsplanV2DTO";
import {
  ARBEIDSTAKER_DEFAULT,
  VIRKSOMHET_BRANNOGBIL,
  VIRKSOMHET_PONTYPANDY,
} from "../common/mockConstants";
import { addWeeks } from "@/utils/datoUtils";

// Oppfølgingstilfeller i mock:
// Tilfelle 1: 2019-06-06 → 2020-01-21 (Pontypandy)
// Tilfelle 2: 2020-02-21 → 2020-12-10 (Pontypandy)
// Current tilfelle: ~40 uker siden → ~20 uker frem (Pontypandy + BrannOgBil)
export const oppfolgingsplanV2Mock: OppfolgingsplanV2DTO[] = [
  // Current tilfelle — Pontypandy (opprettet ~30 uker siden)
  {
    uuid: "3abbad77-1206-4432-b2f5-953566e5e9a1",
    fnr: ARBEIDSTAKER_DEFAULT.personIdent,
    deltMedNavTidspunkt: addWeeks(new Date(), -30).toISOString(),
    virksomhetsnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
    opprettet: addWeeks(new Date(), -30).toISOString(),
    sistEndret: addWeeks(new Date(), -30).toISOString(),
    evalueringsdato: addWeeks(new Date(), -20).toISOString().slice(0, 10),
  },
  // Current tilfelle — BrannOgBil (opprettet ~20 uker siden)
  {
    uuid: "ac8735fe-25ba-4af8-a4f6-64e35a6d6060",
    fnr: ARBEIDSTAKER_DEFAULT.personIdent,
    deltMedNavTidspunkt: addWeeks(new Date(), -20).toISOString(),
    virksomhetsnummer: VIRKSOMHET_BRANNOGBIL.virksomhetsnummer,
    opprettet: addWeeks(new Date(), -20).toISOString(),
    sistEndret: addWeeks(new Date(), -20).toISOString(),
    evalueringsdato: addWeeks(new Date(), -10).toISOString().slice(0, 10),
  },
  // Tilfelle 2 (opprettet 2020-06-01, innenfor 2020-02-21 → 2020-12-10)
  {
    uuid: "774b3632-0e35-4d8d-b71f-10c99ab7ecfa",
    fnr: ARBEIDSTAKER_DEFAULT.personIdent,
    deltMedNavTidspunkt: "2020-06-01T10:00:00.000Z",
    virksomhetsnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
    opprettet: "2020-06-01T10:00:00.000Z",
    sistEndret: "2020-06-01T10:00:00.000Z",
    evalueringsdato: "2020-09-01",
  },
];
