import React from "react";
import { DraftTextDTO, useDraftQuery } from "@/hooks/useDraftQuery";
import OppfyltForm from "@/sider/arbeidsuforhet/oppfylt/OppfyltForm";
import AppSpinner from "@/components/AppSpinner";

export default function OppfyltFormContainer() {
  const draft = useDraftQuery<DraftTextDTO>("arbeidsuforhet-oppfylt");

  return draft.isPending ? (
    <AppSpinner />
  ) : (
    <OppfyltForm begrunnelseUtkast={draft.data?.begrunnelse} />
  );
}
