import React from "react";
import { useManglendemedvirkningVurderingQuery } from "@/data/manglendemedvirkning/manglendeMedvirkningQueryHooks";
import { Navigate } from "react-router-dom";
import { manglendeMedvirkningPath } from "@/routers/AppRouter";
import { VurderingType } from "@/data/manglendemedvirkning/manglendeMedvirkningTypes";
import OppfyltSkjema from "@/sider/manglendemedvirkning/oppfylt/OppfyltSkjema";

export default function OppfyltSide() {
  const { sisteVurdering } = useManglendemedvirkningVurderingQuery();
  const isSisteVurderingForhandsvarsel =
    sisteVurdering?.vurderingType === VurderingType.FORHANDSVARSEL;
  const forhandsvarselSendtDato = sisteVurdering?.varsel?.createdAt;

  return isSisteVurderingForhandsvarsel && forhandsvarselSendtDato ? (
    <OppfyltSkjema forhandsvarselSendtDato={forhandsvarselSendtDato} />
  ) : (
    <Navigate to={manglendeMedvirkningPath} />
  );
}
