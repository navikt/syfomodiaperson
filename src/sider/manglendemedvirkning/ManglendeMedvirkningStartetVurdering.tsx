import React, { ReactElement } from "react";
import {
  VurderingResponseDTO,
  VurderingType,
} from "@/data/manglendemedvirkning/manglendeMedvirkningTypes";
import ForhandsvarselSendt from "@/sider/manglendemedvirkning/forhandsvarsel/ForhandsvarselSendt";
import ForhandsvarselSkjema from "@/sider/manglendemedvirkning/forhandsvarsel/ForhandsvarselSkjema";

interface ManglendeMedvirkningStartetVurderingProps {
  sisteVurdering: VurderingResponseDTO | undefined;
}

export const ManglendeMedvirkningStartetVurdering = ({
  sisteVurdering,
}: ManglendeMedvirkningStartetVurderingProps): ReactElement => {
  const isForhandsvarsel =
    sisteVurdering?.vurderingType === VurderingType.FORHANDSVARSEL;
  return isForhandsvarsel ? (
    <ForhandsvarselSendt forhandsvarsel={sisteVurdering} />
  ) : (
    <ForhandsvarselSkjema />
  );
};
