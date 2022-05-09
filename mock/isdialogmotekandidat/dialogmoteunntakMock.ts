import { generateUUID } from "../../src/utils/uuidUtils";
import {
  ARBEIDSTAKER_DEFAULT,
  VEILEDER_DEFAULT,
} from "../common/mockConstants";
import { UnntakArsak } from "../../src/data/dialogmotekandidat/types/dialogmoteunntakTypes";

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
  UnntakArsak.ARBEIDSFORHOLD_OPPHORT,
  "Arbeidstaker jobber ikke lenger hos arbeidsgiver."
);
export const dialogmoteunntakUtenBeskrivelse = createDialogmoteunntak(
  UnntakArsak.FORVENTET_FRISKMELDING_INNEN_28UKER,
  undefined
);

export const dialogmoteunntakMock = [
  dialogmoteunntakMedBeskrivelse,
  dialogmoteunntakUtenBeskrivelse,
];
