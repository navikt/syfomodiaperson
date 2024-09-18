import { VurderingResponseDTO } from "@/data/manglendemedvirkning/manglendeMedvirkningTypes";
import dayjs from "dayjs";
import React from "react";
import ForhandsvarselBeforeDeadline from "@/sider/manglendemedvirkning/forhandsvarsel/ForhandsvarselBeforeDeadline";
import ForhandsvarselAfterDeadline from "@/sider/manglendemedvirkning/forhandsvarsel/ForhandsvarselAfterDeadline";

interface Props {
  sisteVurdering: VurderingResponseDTO;
}

export default function ForhandsvarselSendt({ sisteVurdering }: Props) {
  const isForhandsvarselExpired = dayjs(
    sisteVurdering?.varsel?.svarfrist
  ).isBefore(dayjs(new Date()), "date");

  return isForhandsvarselExpired ? (
    <ForhandsvarselAfterDeadline />
  ) : (
    <ForhandsvarselBeforeDeadline />
  );
}
