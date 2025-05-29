import React from "react";
import { useGetArbeidsuforhetVurderingerQuery } from "@/sider/arbeidsuforhet/hooks/arbeidsuforhetQueryHooks";
import { VurderingType } from "@/sider/arbeidsuforhet/data/arbeidsuforhetTypes";
import { arbeidsuforhetPath } from "@/routers/AppRouter";
import { Navigate } from "react-router-dom";
import { ArbeidsuforhetIkkeAktuellSkjema } from "@/sider/arbeidsuforhet/ikkeaktuell/ArbeidsuforhetIkkeAktuellSkjema";
import ArbeidsuforhetSide from "../ArbeidsuforhetSide";

export default function ArbeidsuforhetIkkeAktuell() {
  const { data } = useGetArbeidsuforhetVurderingerQuery();
  const isForhandsvarsel = data[0]?.type === VurderingType.FORHANDSVARSEL;

  return (
    <ArbeidsuforhetSide>
      {isForhandsvarsel ? (
        <ArbeidsuforhetIkkeAktuellSkjema />
      ) : (
        <Navigate to={arbeidsuforhetPath} />
      )}
    </ArbeidsuforhetSide>
  );
}
