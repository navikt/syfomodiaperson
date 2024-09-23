import React, { useState } from "react";
import { useManglendeMedvirkningVurderingQuery } from "@/data/manglendemedvirkning/manglendeMedvirkningQueryHooks";
import { VurderingType } from "@/data/manglendemedvirkning/manglendeMedvirkningTypes";
import { ManglendeMedvirkningStartetVurdering } from "@/sider/manglendemedvirkning/ManglendeMedvirkningStartetVurdering";
import { ManglendeMedvirkningNyVurdering } from "@/sider/manglendemedvirkning/ManglendeMedvirkningNyVurdering";

export default function ManglendeMedvirkning() {
  const { sisteVurdering } = useManglendeMedvirkningVurderingQuery();
  const isForhandsvarsel =
    sisteVurdering?.vurderingType === VurderingType.FORHANDSVARSEL;
  const [showStartetVurdering, setShowStartetVurdering] = useState(false);

  return showStartetVurdering || isForhandsvarsel ? (
    <ManglendeMedvirkningStartetVurdering sisteVurdering={sisteVurdering} />
  ) : (
    <ManglendeMedvirkningNyVurdering
      handleClick={() => setShowStartetVurdering(true)}
    />
  );
}
