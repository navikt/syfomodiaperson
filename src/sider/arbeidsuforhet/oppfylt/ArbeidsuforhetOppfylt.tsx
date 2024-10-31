import React, { ReactElement } from "react";
import { useGetArbeidsuforhetVurderingerQuery } from "@/data/arbeidsuforhet/arbeidsuforhetQueryHooks";
import { OppfyltForm } from "@/sider/arbeidsuforhet/oppfylt/OppfyltForm";

export const ArbeidsuforhetOppfylt = (): ReactElement => {
  const { data } = useGetArbeidsuforhetVurderingerQuery();
  const sisteVurdering = data[0];
  const forhandsvarselSendtDato = sisteVurdering?.varsel?.createdAt;

  return <OppfyltForm forhandsvarselSendtDato={forhandsvarselSendtDato} />;
};
