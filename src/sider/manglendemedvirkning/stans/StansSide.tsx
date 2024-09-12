import { useManglendeMedvirkningVurderingQuery } from "@/data/manglendemedvirkning/manglendeMedvirkningQueryHooks";
import { manglendeMedvirkningPath } from "@/routers/AppRouter";
import { isExpiredForhandsvarsel } from "@/utils/datoUtils";
import React from "react";
import { Navigate } from "react-router-dom";
import StansSkjema from "./StansSkjema";

export default function StansSide() {
  const { data } = useManglendeMedvirkningVurderingQuery();
  const sisteVurdering = data[0];
  const isForhandsvarselExpired = isExpiredForhandsvarsel(
    sisteVurdering?.varsel?.svarfrist
  );
  return isForhandsvarselExpired ? (
    <StansSkjema />
  ) : (
    <Navigate to={manglendeMedvirkningPath} />
  );
}
