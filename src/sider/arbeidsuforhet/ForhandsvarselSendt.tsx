import React from "react";
import { useGetArbeidsuforhetVurderingerQuery } from "@/data/arbeidsuforhet/arbeidsuforhetQueryHooks";
import { ForhandsvarselBeforeDeadline } from "@/sider/arbeidsuforhet/ForhandsvarselBeforeDeadline";
import { ForhandsvarselAfterDeadline } from "@/sider/arbeidsuforhet/ForhandsvarselAfterDeadline";

export const ForhandsvarselSendt = () => {
  const { data } = useGetArbeidsuforhetVurderingerQuery();
  const forhandsvarsel = data[0];
  const isForhandsvarselExpired = forhandsvarsel.varsel?.isExpired;

  return (
    <div>
      {isForhandsvarselExpired ? (
        <ForhandsvarselAfterDeadline />
      ) : (
        <ForhandsvarselBeforeDeadline />
      )}
    </div>
  );
};
