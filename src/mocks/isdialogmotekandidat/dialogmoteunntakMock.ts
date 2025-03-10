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
