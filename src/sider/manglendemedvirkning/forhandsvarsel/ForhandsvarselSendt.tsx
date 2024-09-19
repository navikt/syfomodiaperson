import { VurderingResponseDTO } from "@/data/manglendemedvirkning/manglendeMedvirkningTypes";
import React from "react";
import ForhandsvarselBeforeDeadline from "@/sider/manglendemedvirkning/forhandsvarsel/ForhandsvarselBeforeDeadline";
import ForhandsvarselAfterDeadline from "@/sider/manglendemedvirkning/forhandsvarsel/ForhandsvarselAfterDeadline";
import { isExpiredForhandsvarsel } from "@/utils/datoUtils";

interface Props {
  forhandsvarsel: VurderingResponseDTO;
}

export default function ForhandsvarselSendt({ forhandsvarsel }: Props) {
  const isForhandsvarselExpired = isExpiredForhandsvarsel(
    forhandsvarsel.varsel?.svarfrist
  );

  return isForhandsvarselExpired ? (
    <ForhandsvarselAfterDeadline forhandsvarsel={forhandsvarsel} />
  ) : (
    <ForhandsvarselBeforeDeadline forhandsvarsel={forhandsvarsel} />
  );
}
