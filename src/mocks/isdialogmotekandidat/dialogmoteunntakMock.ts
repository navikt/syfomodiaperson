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

const createDialogmoteunntak = (arsak: UnntakArsak, beskrivelse?: string) => {
  return {
    uuid: generateUUID(),
    createdAt: new Date().toDateString(),
    createdBy: VEILEDER_DEFAULT.ident,
    personIdent: ARBEIDSTAKER_DEFAULT.personIdent,
    arsak,
    beskrivelse,
  };
};

export const dialogmoteunntakMedBeskrivelse = createDialogmoteunntak(
  DeprecatedUnntakArsak.ARBEIDSFORHOLD_OPPHORT,
  "Arbeidstaker jobber ikke lenger hos arbeidsgiver."
);
export const dialogmoteunntakUtenBeskrivelse = createDialogmoteunntak(
  ValidUnntakArsak.FORVENTET_FRISKMELDING_INNEN_28UKER,
  undefined
);

export const dialogmoteunntakMock = [
  dialogmoteunntakMedBeskrivelse,
  dialogmoteunntakUtenBeskrivelse,
];

const createDialogmoteikkeaktuell = (
  arsak: IkkeAktuellArsak,
  beskrivelse?: string
) => {
  return {
    uuid: generateUUID(),
    createdAt: new Date().toDateString(),
    createdBy: VEILEDER_DEFAULT.ident,
    personIdent: ARBEIDSTAKER_DEFAULT.personIdent,
    arsak,
    beskrivelse,
  };
};

export const dialogmoteikkeaktuellMock = [
  createDialogmoteikkeaktuell(
    IkkeAktuellArsak.ARBEIDSTAKER_AAP,
    "Arbeidstaker mottar AAP."
  ),
  createDialogmoteikkeaktuell(
    IkkeAktuellArsak.ARBEIDSTAKER_DOD,
    "Arbeidstaker er død."
  ),
];
