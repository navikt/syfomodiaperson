import React, { useState } from "react";
import { useManglendemedvirkningVurderingQuery } from "@/data/manglendemedvirkning/manglendeMedvirkningQueryHooks";
import { VurderingType } from "@/data/manglendemedvirkning/manglendeMedvirkningTypes";
import ManglendeMedvirkningNyVurdering from "@/sider/manglendemedvirkning/ManglendeMedvirkningNyVurdering";
import ForhandsvarselSendt from "@/sider/manglendemedvirkning/forhandsvarsel/ForhandsvarselSendt";
import ForhandsvarselSkjema from "@/sider/manglendemedvirkning/forhandsvarsel/ForhandsvarselSkjema";

export default function ManglendeMedvirkning() {
  const { sisteVurdering } = useManglendemedvirkningVurderingQuery();
  const isForhandsvarsel =
    sisteVurdering?.vurderingType === VurderingType.FORHANDSVARSEL;
  const [showStartetVurdering, setShowStartetVurdering] = useState(false);

  return showStartetVurdering || isForhandsvarsel ? (
    isForhandsvarsel ? (
      <ForhandsvarselSendt forhandsvarsel={sisteVurdering} />
    ) : (
      <ForhandsvarselSkjema />
    )
  ) : (
    <ManglendeMedvirkningNyVurdering
      handleClick={() => setShowStartetVurdering(true)}
    />
  );
}
