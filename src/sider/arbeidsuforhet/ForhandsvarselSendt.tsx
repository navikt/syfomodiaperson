import React from "react";
import { ForhandsvarselBeforeDeadline } from "@/sider/arbeidsuforhet/ForhandsvarselBeforeDeadline";
import { ForhandsvarselAfterDeadline } from "@/sider/arbeidsuforhet/ForhandsvarselAfterDeadline";
import { VurderingResponseDTO } from "@/data/arbeidsuforhet/arbeidsuforhetTypes";

interface ForhandsvarselSendtProps {
  forhandsvarsel: VurderingResponseDTO;
}

export const ForhandsvarselSendt = ({
  forhandsvarsel,
}: ForhandsvarselSendtProps) => {
  const isForhandsvarselExpired = forhandsvarsel.varsel?.isExpired;

  return isForhandsvarselExpired ? (
    <ForhandsvarselAfterDeadline forhandsvarsel={forhandsvarsel} />
  ) : (
    <ForhandsvarselBeforeDeadline forhandsvarsel={forhandsvarsel} />
  );
};
