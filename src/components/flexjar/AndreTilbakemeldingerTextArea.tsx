import { Label, Textarea } from "@navikt/ds-react";
import React from "react";

const texts = {
  label: "Har du noen tilbakemeldinger om denne siden?",
};

interface Props {
  textValue?: string;
  setTextValue: (text: string) => void;
}

export default function AndreTilbakemeldingerTextArea({
  textValue,
  setTextValue,
}: Props) {
  return (
    <Textarea
      maxLength={500}
      minRows={3}
      size="small"
      label={<Label>{texts.label}</Label>}
      value={textValue ?? ""}
      onChange={(e) => setTextValue(e.target.value)}
    />
  );
}
