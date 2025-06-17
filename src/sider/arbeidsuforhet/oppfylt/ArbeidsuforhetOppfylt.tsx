import React from "react";
import { useGetArbeidsuforhetVurderingerQuery } from "@/sider/arbeidsuforhet/hooks/arbeidsuforhetQueryHooks";
import { VurderingType } from "@/sider/arbeidsuforhet/data/arbeidsuforhetTypes";
import OppfyltForm from "@/sider/arbeidsuforhet/oppfylt/OppfyltForm";
import { arbeidsuforhetPath } from "@/routers/AppRouter";
import { Navigate } from "react-router-dom";

export default function ArbeidsuforhetOppfylt() {
  const { data } = useGetArbeidsuforhetVurderingerQuery();
  const sisteVurdering = data[0];
  const isForhandsvarsel =
    sisteVurdering?.type === VurderingType.FORHANDSVARSEL;
  const forhandsvarselSendtDato = sisteVurdering?.varsel?.createdAt;

  return isForhandsvarsel && forhandsvarselSendtDato ? (
    <OppfyltForm forhandsvarselSendtDato={forhandsvarselSendtDato} />
  ) : (
    <Navigate to={arbeidsuforhetPath} />
  );
}
