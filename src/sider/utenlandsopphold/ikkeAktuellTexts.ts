import { IkkeAktuellArsakDTO } from "@/data/utenlandsopphold/utenlandsoppholdTypes.ts";

/**
 * Visningstekster for årsakene en veileder kan velge når en søknad
 * settes til «Ikke aktuell». Delt mellom skjemaet, bekreftelsesdialogen
 * og oversikts-/detaljvisningen, slik at årsaken vises likt overalt.
 */
export const ikkeAktuellArsakTexts: Record<IkkeAktuellArsakDTO, string> = {
  [IkkeAktuellArsakDTO.BEHANDLET_I_INFOTRYGD]: "Behandlet i Infotrygd",
  [IkkeAktuellArsakDTO.DUPLIKAT]: "Duplikat",
  [IkkeAktuellArsakDTO.ANNET]: "Annet",
};
