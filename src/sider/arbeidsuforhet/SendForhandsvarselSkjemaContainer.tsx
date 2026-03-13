import React from "react";
import { DraftTextDTO, useDraftQuery } from "@/hooks/useDraftQuery";
import SendForhandsvarselSkjema from "@/sider/arbeidsuforhet/SendForhandsvarselSkjema";
import AppSpinner from "@/components/AppSpinner";

export default function SendForhandsvarselSkjemaContainer() {
  const draft = useDraftQuery<DraftTextDTO>("arbeidsuforhet-forhandsvarsel");

  if (draft.isPending) {
    return <AppSpinner />;
  }

  return (
    <SendForhandsvarselSkjema initiellBegrunnelse={draft.data?.begrunnelse} />
  );
}
