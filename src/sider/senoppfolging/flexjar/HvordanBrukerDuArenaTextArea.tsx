import { Label, Textarea } from "@navikt/ds-react";
import React from "react";

const texts = {
  label: "Hvordan bruker du Arena til dette?",
  description: "Ikke skriv inn navn eller andre personopplysninger.",
};

interface Props {
  textValue?: string;
  setTextValue: (text: string) => void;
}

export default function HvordanBrukerDuArenaTextArea({
  textValue,
  setTextValue,
}: Props) {
  return (
    <Textarea
      maxLength={500}
      minRows={3}
      size="small"
      label={<Label>{texts.label}</Label>}
      description={texts.description}
      value={textValue ?? ""}
      onChange={(e) => setTextValue(e.target.value)}
    />
  );
}
