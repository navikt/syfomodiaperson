import React from "react";
import ForhandsvarselBeforeDeadline from "@/sider/arbeidsuforhet/ForhandsvarselBeforeDeadline";
import ForhandsvarselAfterDeadline from "@/sider/arbeidsuforhet/ForhandsvarselAfterDeadline";
import { VurderingResponseDTO } from "@/sider/arbeidsuforhet/data/arbeidsuforhetTypes";

interface Props {
  forhandsvarsel: VurderingResponseDTO;
}

export default function ForhandsvarselSendt({ forhandsvarsel }: Props) {
  const isForhandsvarselExpired =
    forhandsvarsel && forhandsvarsel?.varsel?.isExpired;

  return (
    <div>
      {isForhandsvarselExpired ? (
        <ForhandsvarselAfterDeadline forhandsvarsel={forhandsvarsel} />
      ) : (
        <ForhandsvarselBeforeDeadline forhandsvarsel={forhandsvarsel} />
      )}
    </div>
  );
}
