import {
  VIRKSOMHET_BRANNOGBIL,
  VIRKSOMHET_PONTYPANDY,
  VIRKSOMHET_UTEN_NARMESTE_LEDER,
} from "../common/mockConstants";

export const virksomhetMock = (virksomhetsnummer?: string) => {
  switch (virksomhetsnummer) {
    case VIRKSOMHET_PONTYPANDY.virksomhetsnummer:
      return { navn: VIRKSOMHET_PONTYPANDY.virksomhetsnavn };
    case VIRKSOMHET_BRANNOGBIL.virksomhetsnummer:
      return { navn: VIRKSOMHET_BRANNOGBIL.virksomhetsnavn };
    case VIRKSOMHET_UTEN_NARMESTE_LEDER.virksomhetsnummer:
      return { navn: VIRKSOMHET_UTEN_NARMESTE_LEDER.virksomhetsnavn };
    default:
      return null;
  }
};
