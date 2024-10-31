import React, { ReactElement } from "react";
import { useGetArbeidsuforhetVurderingerQuery } from "@/data/arbeidsuforhet/arbeidsuforhetQueryHooks";
import { VurderingType } from "@/data/arbeidsuforhet/arbeidsuforhetTypes";
import { Navigate } from "react-router-dom";
import { arbeidsuforhetForhandsvarselPath } from "@/routers/AppRouter";
import { NyVurdering } from "@/sider/arbeidsuforhet/NyVurdering";

export const Arbeidsuforhet = (): ReactElement => {
  const { data } = useGetArbeidsuforhetVurderingerQuery();
  const sisteVurdering = data[0];
  const isForhandsvarsel =
    sisteVurdering?.type === VurderingType.FORHANDSVARSEL;

  return isForhandsvarsel ? (
    <Navigate to={arbeidsuforhetForhandsvarselPath} />
  ) : (
    <NyVurdering />
  );
};
