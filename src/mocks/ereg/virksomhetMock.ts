import {
  VIRKSOMHET_BRANNOGBIL,
  VIRKSOMHET_ENTERPRISE,
  VIRKSOMHET_KONKURS,
  VIRKSOMHET_PONTYPANDY,
  VIRKSOMHET_UTEN_NARMESTE_LEDER,
} from "@/mocks/common/mockConstants";
import { EregOrganisasjonResponseDTO } from "@/data/virksomhet/types/EregOrganisasjonResponseDTO";

export const eregOrganisasjonResponse = (
  virksomhetsnavn: string,
): EregOrganisasjonResponseDTO => {
  return {
    type: "Virksomhet",
    navn: {
      navnelinje1: virksomhetsnavn,
      redigertnavn: `${virksomhetsnavn}`,
    },
    organisasjonDetaljer: {
      naeringer: [
        {
          naeringskode: "62.200",
          bruksperiode: { fom: "2025-09-01T00:00:00.000Z" },
        },
      ],
    },
  };
};

export const virksomhetMock = (virksomhetsnummer?: string) => {
  switch (virksomhetsnummer) {
    case VIRKSOMHET_PONTYPANDY.virksomhetsnummer:
      return eregOrganisasjonResponse(VIRKSOMHET_PONTYPANDY.virksomhetsnavn);
    case VIRKSOMHET_BRANNOGBIL.virksomhetsnummer:
      return eregOrganisasjonResponse(VIRKSOMHET_BRANNOGBIL.virksomhetsnavn);
    case VIRKSOMHET_UTEN_NARMESTE_LEDER.virksomhetsnummer:
      return eregOrganisasjonResponse(
        VIRKSOMHET_UTEN_NARMESTE_LEDER.virksomhetsnavn,
      );
    case VIRKSOMHET_ENTERPRISE.virksomhetsnummer:
      return eregOrganisasjonResponse(VIRKSOMHET_ENTERPRISE.virksomhetsnavn);
    case VIRKSOMHET_KONKURS.virksomhetsnummer:
      return eregOrganisasjonResponse(VIRKSOMHET_KONKURS.virksomhetsnavn);
    default:
      return null;
  }
};
