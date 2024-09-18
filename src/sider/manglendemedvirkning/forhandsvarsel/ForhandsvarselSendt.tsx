import { VurderingResponseDTO } from "@/data/manglendemedvirkning/manglendeMedvirkningTypes";
import dayjs from "dayjs";
import React from "react";
import ForhandsvarselBeforeDeadline from "@/sider/manglendemedvirkning/forhandsvarsel/ForhandsvarselBeforeDeadline";
import ForhandsvarselAfterDeadline from "@/sider/manglendemedvirkning/forhandsvarsel/ForhandsvarselAfterDeadline";

interface Props {
  forhandsvarsel: VurderingResponseDTO;
}

export default function ForhandsvarselSendt({ forhandsvarsel }: Props) {
  const isForhandsvarselExpired = dayjs(
    forhandsvarsel?.varsel?.svarfrist
  ).isBefore(dayjs(new Date()), "date");

  return isForhandsvarselExpired ? (
    <ForhandsvarselAfterDeadline forhandsvarsel={forhandsvarsel} />
  ) : (
    <ForhandsvarselBeforeDeadline forhandsvarsel={forhandsvarsel} />
  );
}
