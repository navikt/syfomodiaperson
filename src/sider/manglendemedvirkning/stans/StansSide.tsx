import { useManglendeMedvirkningVurderingQuery } from "@/data/manglendemedvirkning/manglendeMedvirkningQueryHooks";
import { manglendeMedvirkningPath } from "@/routers/AppRouter";
import { isExpiredForhandsvarsel } from "@/utils/datoUtils";
import React from "react";
import { Navigate } from "react-router-dom";
import StansSkjema from "./StansSkjema";

export default function StansSide() {
  const { sisteVurdering } = useManglendeMedvirkningVurderingQuery();
  const isForhandsvarselExpired = isExpiredForhandsvarsel(
    sisteVurdering?.varsel?.svarfrist
  );
  return isForhandsvarselExpired && sisteVurdering?.varsel?.svarfrist ? (
    <StansSkjema varselSvarfrist={sisteVurdering.varsel.svarfrist} />
  ) : (
    <Navigate to={manglendeMedvirkningPath} />
  );
}
