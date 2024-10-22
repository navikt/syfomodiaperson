import React, { ReactElement } from "react";
import { useGetArbeidsuforhetVurderingerQuery } from "@/data/arbeidsuforhet/arbeidsuforhetQueryHooks";
import { Navigate } from "react-router-dom";
import { arbeidsuforhetPath } from "@/routers/AppRouter";
import { AvslagForm } from "@/sider/arbeidsuforhet/avslag/AvslagForm";

export function ArbeidsuforhetAvslag(): ReactElement {
  const { data } = useGetArbeidsuforhetVurderingerQuery();
  const sisteVurdering = data[0];
  const isForhandsvarselExpired = sisteVurdering.varsel?.isExpired;

  return sisteVurdering.varsel && isForhandsvarselExpired ? (
    <AvslagForm varselSvarfrist={sisteVurdering.varsel.svarfrist} />
  ) : (
    <Navigate to={arbeidsuforhetPath} />
  );
}
