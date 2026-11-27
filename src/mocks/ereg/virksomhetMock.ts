import {
  VIRKSOMHET_BRANNOGBIL,
  VIRKSOMHET_ENTERPRISE,
  VIRKSOMHET_KONKURS,
  VIRKSOMHET_PONTYPANDY,
  VIRKSOMHET_UTEN_NARMESTE_LEDER,
} from "@/mocks/common/mockConstants";
import { EregOrganisasjonResponseDTO } from "@/data/virksomhet/types/EregOrganisasjonResponseDTO";

/** Creates an organisation fixture with type-specific defaults and field overrides. */
export function eregOrganisasjonResponse(
  overrides: Partial<EregOrganisasjonResponseDTO>,
): EregOrganisasjonResponseDTO {
  return {
    type: "Virksomhet",
    ...(!overrides.type || overrides.type === "Virksomhet"
      ? {
          inngaarIJuridiskEnheter: [{ organisasjonsnummer: "900000001" }],
          organisasjonDetaljer: {
            naeringer: [
              {
                naeringskode: "62.200",
                bruksperiode: { fom: "2025-09-01T00:00:00.000Z" },
              },
            ],
          },
        }
      : {}),
    ...overrides,
  };
}

/** Returns the Ereg fixture for a company or its legal entity. */
export function virksomhetMock(virksomhetsnummer?: string) {
  switch (virksomhetsnummer) {
    case "900000001":
      return eregOrganisasjonResponse({
        type: "JuridiskEnhet",
        organisasjonsnummer: "900000001",
        navn: { navnelinje1: "Eksempel hovedenhet" },
        juridiskEnhetDetaljer: { sektorkode: "2100" },
      });
    case VIRKSOMHET_PONTYPANDY.virksomhetsnummer:
      return eregOrganisasjonResponse({
        navn: { navnelinje1: VIRKSOMHET_PONTYPANDY.virksomhetsnavn },
      });
    case VIRKSOMHET_BRANNOGBIL.virksomhetsnummer:
      return eregOrganisasjonResponse({
        navn: { navnelinje1: VIRKSOMHET_BRANNOGBIL.virksomhetsnavn },
      });
    case VIRKSOMHET_UTEN_NARMESTE_LEDER.virksomhetsnummer:
      return eregOrganisasjonResponse({
        navn: { navnelinje1: VIRKSOMHET_UTEN_NARMESTE_LEDER.virksomhetsnavn },
      });
    case VIRKSOMHET_ENTERPRISE.virksomhetsnummer:
      return eregOrganisasjonResponse({
        navn: { navnelinje1: VIRKSOMHET_ENTERPRISE.virksomhetsnavn },
      });
    case VIRKSOMHET_KONKURS.virksomhetsnummer:
      return eregOrganisasjonResponse({
        navn: { navnelinje1: VIRKSOMHET_KONKURS.virksomhetsnavn },
      });
    default:
      return null;
  }
}
