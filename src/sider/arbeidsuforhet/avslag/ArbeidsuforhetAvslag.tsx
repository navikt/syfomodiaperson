import React, { ReactElement } from "react";
import { useGetArbeidsuforhetVurderingerQuery } from "@/sider/arbeidsuforhet/hooks/arbeidsuforhetQueryHooks";
import { Navigate } from "react-router-dom";
import { arbeidsuforhetPath } from "@/AppRouter";
import { AvslagForm } from "@/sider/arbeidsuforhet/avslag/AvslagForm";

export default function ArbeidsuforhetAvslag(): ReactElement {
  const { data } = useGetArbeidsuforhetVurderingerQuery();
  const sisteVurdering = data[0];

  return sisteVurdering.varsel?.isExpired ? (
    <AvslagForm sisteVurdering={sisteVurdering} />
  ) : (
    <Navigate to={arbeidsuforhetPath} />
  );
}
