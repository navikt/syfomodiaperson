import { IkkeAktuellGrunnDTO } from "@/data/utenlandsopphold/utenlandsoppholdTypes.ts";

/**
 * Visningstekster for grunnene en veileder kan velge når en søknad
 * settes til «Ikke aktuell». Delt mellom skjemaet, bekreftelsesdialogen
 * og oversikts-/detaljvisningen, slik at grunnen vises likt overalt.
 */
export const ikkeAktuellGrunnTexts: Record<IkkeAktuellGrunnDTO, string> = {
  [IkkeAktuellGrunnDTO.BEHANDLET_I_INFOTRYGD]: "Behandlet i Infotrygd",
  [IkkeAktuellGrunnDTO.DUPLIKAT]: "Duplikat",
  [IkkeAktuellGrunnDTO.ANNET]: "Annet",
};
