import React from "react";
import { useManglendeMedvirkningVurderingQuery } from "@/data/manglendemedvirkning/manglendeMedvirkningQueryHooks";
import { Navigate } from "react-router-dom";
import { manglendeMedvirkningPath } from "@/routers/AppRouter";
import { VurderingType } from "@/data/manglendemedvirkning/manglendeMedvirkningTypes";
import IkkeAktuellSkjema from "@/sider/manglendemedvirkning/ikkeaktuell/IkkeAktuellSkjema";

export default function IkkeAktuellSide() {
  const { sisteVurdering } = useManglendeMedvirkningVurderingQuery();
  const isSisteVurderingForhandsvarsel =
    sisteVurdering?.vurderingType === VurderingType.FORHANDSVARSEL;

  return isSisteVurderingForhandsvarsel ? (
    <IkkeAktuellSkjema />
  ) : (
    <Navigate to={manglendeMedvirkningPath} />
  );
}
