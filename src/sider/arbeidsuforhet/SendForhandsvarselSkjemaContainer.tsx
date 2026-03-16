import React from "react";
import { DraftTextDTO, useDraftQuery } from "@/hooks/useDraftQuery";
import SendForhandsvarselSkjema from "@/sider/arbeidsuforhet/SendForhandsvarselSkjema";
import AppSpinner from "@/components/AppSpinner";

export default function SendForhandsvarselSkjemaContainer() {
  const draft = useDraftQuery<DraftTextDTO>("arbeidsuforhet-forhandsvarsel");

  return draft.isPending ? (
    <AppSpinner />
  ) : (
    <SendForhandsvarselSkjema begrunnelseUtkast={draft.data?.begrunnelse} />
  );
}
