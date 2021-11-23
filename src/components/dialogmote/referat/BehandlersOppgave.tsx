import { FlexRow, PaddingSize } from "@/components/Layout";
import React from "react";
import { ReferatInfoColumn } from "./ReferatInfoColumn";
import { ReferatTextareaFieldColumn } from "./ReferatTextareaFieldColumn";

export const MAX_LENGTH_BEHANDLERS_OPPGAVE = 200;

const texts = {
  label: "Behandlerens oppgave (valgfri):",
  placeholder: "Hva avtalte dere at behandleren skal gjøre?",
};

export const BehandlersOppgave = () => (
  <FlexRow bottomPadding={PaddingSize.MD}>
    <ReferatTextareaFieldColumn
      size="medium"
      fieldName={"behandlersOppgave"}
      label={texts.label}
      placeholder={texts.placeholder}
      maxLength={MAX_LENGTH_BEHANDLERS_OPPGAVE}
    />
    <ReferatInfoColumn />
  </FlexRow>
);
