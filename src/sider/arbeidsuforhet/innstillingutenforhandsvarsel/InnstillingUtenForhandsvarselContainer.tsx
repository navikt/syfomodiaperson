import React from "react";
import { DraftTextDTO, useDraftQuery } from "@/hooks/useDraftQuery";
import InnstillingUtenForhandsvarsel from "@/sider/arbeidsuforhet/innstillingutenforhandsvarsel/InnstillingUtenForhandsvarsel";
import AppSpinner from "@/components/AppSpinner";

export default function InnstillingUtenForhandsvarselContainer() {
  const draft = useDraftQuery<DraftTextDTO>(
    "arbeidsuforhet-avslag-uten-forhandsvarsel"
  );

  return draft.isPending ? (
    <AppSpinner />
  ) : (
    <InnstillingUtenForhandsvarsel
      begrunnelseUtkast={draft.data?.begrunnelse}
    />
  );
}
