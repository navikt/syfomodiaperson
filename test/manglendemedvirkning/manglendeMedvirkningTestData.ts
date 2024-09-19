import {
  VurderingResponseDTO,
  VurderingType,
} from "@/data/manglendemedvirkning/manglendeMedvirkningTypes";
import { generateUUID } from "@/utils/uuidUtils";
import {
  ARBEIDSTAKER_DEFAULT,
  VEILEDER_DEFAULT,
} from "../../mock/common/mockConstants";
import { addWeeks, addDays } from "@/utils/datoUtils";

export const defaultForhandsvarselVurdering: VurderingResponseDTO = {
  uuid: generateUUID(),
  personident: ARBEIDSTAKER_DEFAULT.personIdent,
  createdAt: new Date(),
  veilederident: VEILEDER_DEFAULT.ident,
  vurderingType: VurderingType.FORHANDSVARSEL,
  begrunnelse: "Dette er en begrunnelse",
  document: [],
  varsel: {
    uuid: generateUUID(),
    createdAt: new Date(),
    svarfrist: addWeeks(new Date(), 3),
  },
};

export const defaultForhandsvarselVurderingAfterDeadline: VurderingResponseDTO =
  {
    uuid: generateUUID(),
    personident: ARBEIDSTAKER_DEFAULT.personIdent,
    createdAt: new Date(),
    veilederident: VEILEDER_DEFAULT.ident,
    vurderingType: VurderingType.FORHANDSVARSEL,
    begrunnelse: "Dette er en begrunnelse",
    document: [],
    varsel: {
      uuid: generateUUID(),
      createdAt: addDays(new Date(), -1),
      svarfrist: addDays(new Date(), -1),
    },
  };

export const createManglendeMedvirkningVurdering = (
  type: VurderingType
): VurderingResponseDTO => ({
  personident: ARBEIDSTAKER_DEFAULT.personIdent,
  createdAt: new Date(),
  vurderingType: type,
  begrunnelse: "",
  document: [],
  uuid: generateUUID(),
  varsel: null,
  veilederident: VEILEDER_DEFAULT.ident,
});
