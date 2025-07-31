import { generateUUID } from "@/utils/utils";
import {
  ARBEIDSTAKER_DEFAULT,
  VEILEDER_DEFAULT,
} from "../common/mockConstants";
import {
  DeprecatedUnntakArsak,
  UnntakArsak,
  ValidUnntakArsak,
} from "@/data/dialogmotekandidat/types/dialogmoteunntakTypes";
import { IkkeAktuellArsak } from "@/data/dialogmotekandidat/types/dialogmoteikkeaktuellTypes";
import { daysFromToday } from "../../../test/testUtils";

const createDialogmoteunntak = (
  arsak: UnntakArsak,
  createdAt: Date,
  beskrivelse?: string
) => {
  return {
    uuid: generateUUID(),
    createdAt: createdAt.toDateString(),
    createdBy: VEILEDER_DEFAULT.ident,
    personIdent: ARBEIDSTAKER_DEFAULT.personIdent,
    arsak,
    beskrivelse,
  };
};

export const dialogmoteunntakMedBeskrivelse = createDialogmoteunntak(
  DeprecatedUnntakArsak.ARBEIDSFORHOLD_OPPHORT,
  daysFromToday(-1),
  "Arbeidstaker jobber ikke lenger hos arbeidsgiver."
);
export const dialogmoteunntakUtenBeskrivelse = createDialogmoteunntak(
  ValidUnntakArsak.FORVENTET_FRISKMELDING_INNEN_28UKER,
  daysFromToday(1),
  undefined
);

export const dialogmoteunntakMock = [
  dialogmoteunntakMedBeskrivelse,
  dialogmoteunntakUtenBeskrivelse,
];

const createDialogmoteikkeaktuell = (
  arsak: IkkeAktuellArsak,
  createdAt: Date,
  beskrivelse?: string
) => {
  return {
    uuid: generateUUID(),
    createdAt: createdAt.toDateString(),
    createdBy: VEILEDER_DEFAULT.ident,
    personIdent: ARBEIDSTAKER_DEFAULT.personIdent,
    arsak,
    beskrivelse,
  };
};

export const dialogmoteikkeaktuellMock = [
  createDialogmoteikkeaktuell(
    IkkeAktuellArsak.ARBEIDSTAKER_AAP,
    daysFromToday(-1),
    "Arbeidstaker mottar AAP."
  ),
  createDialogmoteikkeaktuell(
    IkkeAktuellArsak.ARBEIDSTAKER_DOD,
    daysFromToday(1),
    "Arbeidstaker er død."
  ),
];
