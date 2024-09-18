import {
  VurderingResponseDTO,
  VurderingType,
} from "@/data/manglendemedvirkning/manglendeMedvirkningTypes";
import { generateUUID } from "@/utils/uuidUtils";
import {
  ARBEIDSTAKER_DEFAULT,
  VEILEDER_DEFAULT,
} from "../../mock/common/mockConstants";
import { addWeeks } from "@/utils/datoUtils";

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
