import React, { useState } from "react";
import { useManglendemedvirkningVurderingQuery } from "@/data/manglendemedvirkning/manglendeMedvirkningQueryHooks";
import { VurderingType } from "@/data/manglendemedvirkning/manglendeMedvirkningTypes";
import ManglendeMedvirkningNyVurdering from "@/sider/manglendemedvirkning/ManglendeMedvirkningNyVurdering";
import ForhandsvarselSendt from "@/sider/manglendemedvirkning/forhandsvarsel/ForhandsvarselSendt";
import ForhandsvarselSkjema from "@/sider/manglendemedvirkning/forhandsvarsel/ForhandsvarselSkjema";
import { DraftTextDTO, useDraftQuery } from "@/hooks/useDraftQuery";
import AppSpinner from "@/components/AppSpinner";

export default function ManglendeMedvirkning() {
  const { sisteVurdering } = useManglendemedvirkningVurderingQuery();
  const isForhandsvarsel =
    sisteVurdering?.vurderingType === VurderingType.FORHANDSVARSEL;
  const [showStartetVurdering, setShowStartetVurdering] = useState(false);

  const forhandsvarselDraft = useDraftQuery<DraftTextDTO>(
    "manglendemedvirkning-forhandsvarsel"
  );

  return showStartetVurdering || isForhandsvarsel ? (
    isForhandsvarsel ? (
      <ForhandsvarselSendt forhandsvarsel={sisteVurdering} />
    ) : forhandsvarselDraft.isPending ? (
      <AppSpinner />
    ) : (
      <ForhandsvarselSkjema
        initiellBegrunnelse={forhandsvarselDraft.data?.begrunnelse}
      />
    )
  ) : (
    <ManglendeMedvirkningNyVurdering
      handleClick={() => setShowStartetVurdering(true)}
    />
  );
}
