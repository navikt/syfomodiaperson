import React from "react";
import { useManglendeMedvirkningVurderingQuery } from "@/data/manglendemedvirkning/manglendeMedvirkningQueryHooks";
import { VurderingType } from "@/data/manglendemedvirkning/manglendeMedvirkningTypes";
import { Navigate } from "react-router-dom";
import { manglendeMedvirkningPath } from "@/routers/AppRouter";
import UnntakSkjema from "@/sider/manglendemedvirkning/unntak/UnntakSkjema";

export default function UnntakSide() {
  const { sisteVurdering } = useManglendeMedvirkningVurderingQuery();
  const isForhandsvarsel =
    sisteVurdering?.vurderingType === VurderingType.FORHANDSVARSEL;
  const forhandsvarselSendtDato = sisteVurdering?.varsel?.createdAt;

  return isForhandsvarsel && forhandsvarselSendtDato ? (
    <UnntakSkjema forhandsvarselSendtDato={forhandsvarselSendtDato} />
  ) : (
    <Navigate to={manglendeMedvirkningPath} />
  );
}
