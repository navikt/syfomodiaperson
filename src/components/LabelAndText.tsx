import React from "react";
import { BodyShort } from "@navikt/ds-react";

interface Props {
  label: string;
  text: string;
}

export default function LabelAndText({ label, text }: Props) {
  return (
    <div className="text-base font-normal flex gap-1 items-center">
      <BodyShort weight="semibold">{label}</BodyShort>
      <BodyShort>{text}</BodyShort>
    </div>
  );
}
