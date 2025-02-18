import { OppfolgingsplanForesporselResponse } from "@/data/oppfolgingsplan/oppfolgingsplanForesporselHooks";
import { addWeeks } from "@/utils/datoUtils";
import { generateUUID } from "@/utils/utils";
import {
  ANNEN_NARMESTE_LEDER,
  ARBEIDSTAKER_DEFAULT,
  NARMESTE_LEDER_DEFAULT,
  VEILEDER_IDENT_DEFAULT,
  VIRKSOMHET_BRANNOGBIL,
  VIRKSOMHET_ENTERPRISE,
} from "@/mocks/common/mockConstants";

const foresporsel: OppfolgingsplanForesporselResponse = {
  createdAt: addWeeks(new Date(), -1),
  uuid: generateUUID(),
  arbeidstakerPersonident: ARBEIDSTAKER_DEFAULT.personIdent,
  document: [],
  veilederident: VEILEDER_IDENT_DEFAULT,
  narmestelederPersonident: NARMESTE_LEDER_DEFAULT.personident,
  virksomhetsnummer: VIRKSOMHET_ENTERPRISE.virksomhetsnummer,
};
const otherForesporsel: OppfolgingsplanForesporselResponse = {
  ...foresporsel,
  uuid: generateUUID(),
  createdAt: addWeeks(new Date(), -2),
  narmestelederPersonident: ANNEN_NARMESTE_LEDER.personident,
  virksomhetsnummer: VIRKSOMHET_BRANNOGBIL.virksomhetsnummer,
};

export const mockForesporseler = [otherForesporsel, foresporsel];
