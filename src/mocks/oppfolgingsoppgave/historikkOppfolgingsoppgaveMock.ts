import { generateUUID } from "@/utils/uuidUtils";
import { VEILEDER_IDENT_DEFAULT } from "@/mocks/common/mockConstants";
import { Oppfolgingsgrunn } from "@/data/oppfolgingsoppgave/types";
import { addDays } from "@/utils/datoUtils";

const DATO_INNENFOR_OPPFOLGINGSTILFELLE = new Date("2024-06-20");

export const historikkOppfolgingsoppgaveAktivMock = {
  uuid: generateUUID(),
  createdBy: VEILEDER_IDENT_DEFAULT,
  updatedAt: addDays(DATO_INNENFOR_OPPFOLGINGSTILFELLE, 1),
  isActive: true,
  createdAt: DATO_INNENFOR_OPPFOLGINGSTILFELLE,
  removedBy: null,
  versjoner: [
    {
      uuid: generateUUID(),
      createdAt: DATO_INNENFOR_OPPFOLGINGSTILFELLE,
      createdBy: VEILEDER_IDENT_DEFAULT,
      tekst: "Oppfølgingsoppgavetekst",
      oppfolgingsgrunn: Oppfolgingsgrunn.VURDER_ANNEN_YTELSE,
      frist: addDays(DATO_INNENFOR_OPPFOLGINGSTILFELLE, 2),
    },
    {
      uuid: generateUUID(),
      createdAt: addDays(DATO_INNENFOR_OPPFOLGINGSTILFELLE, 1),
      createdBy: VEILEDER_IDENT_DEFAULT,
      tekst: "Oppfølgingsoppgavetekst ver 2",
      oppfolgingsgrunn: Oppfolgingsgrunn.VURDER_ANNEN_YTELSE,
      frist: addDays(DATO_INNENFOR_OPPFOLGINGSTILFELLE, 5),
    },
  ],
};

export const historikkOppfolgingsoppgaveFjernetMock = {
  uuid: generateUUID(),
  createdBy: VEILEDER_IDENT_DEFAULT,
  updatedAt: addDays(DATO_INNENFOR_OPPFOLGINGSTILFELLE, -1),
  isActive: false,
  createdAt: addDays(DATO_INNENFOR_OPPFOLGINGSTILFELLE, -5),
  removedBy: VEILEDER_IDENT_DEFAULT,
  versjoner: [
    {
      uuid: generateUUID(),
      createdAt: addDays(DATO_INNENFOR_OPPFOLGINGSTILFELLE, -5),
      createdBy: VEILEDER_IDENT_DEFAULT,
      tekst: "Oppfølgingsoppgavetekst",
      oppfolgingsgrunn: Oppfolgingsgrunn.TA_KONTAKT_ARBEIDSGIVER,
      frist: DATO_INNENFOR_OPPFOLGINGSTILFELLE,
    },
    {
      uuid: generateUUID(),
      createdAt: addDays(DATO_INNENFOR_OPPFOLGINGSTILFELLE, -4),
      createdBy: VEILEDER_IDENT_DEFAULT,
      tekst: "Oppfølgingsoppgavetekst ver 2",
      oppfolgingsgrunn: Oppfolgingsgrunn.TA_KONTAKT_ARBEIDSGIVER,
      frist: DATO_INNENFOR_OPPFOLGINGSTILFELLE,
    },
    {
      uuid: generateUUID(),
      createdAt: addDays(DATO_INNENFOR_OPPFOLGINGSTILFELLE, -3),
      createdBy: VEILEDER_IDENT_DEFAULT,
      tekst: "Oppfølgingsoppgavetekst ver 3",
      oppfolgingsgrunn: Oppfolgingsgrunn.TA_KONTAKT_ARBEIDSGIVER,
      frist: DATO_INNENFOR_OPPFOLGINGSTILFELLE,
    },
    {
      uuid: generateUUID(),
      createdAt: addDays(DATO_INNENFOR_OPPFOLGINGSTILFELLE, -2),
      createdBy: VEILEDER_IDENT_DEFAULT,
      tekst: "Oppfølgingsoppgavetekst ver 4",
      oppfolgingsgrunn: Oppfolgingsgrunn.TA_KONTAKT_ARBEIDSGIVER,
      frist: DATO_INNENFOR_OPPFOLGINGSTILFELLE,
    },
  ],
};
