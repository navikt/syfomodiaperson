import { Textarea } from "@navikt/ds-react";
import React from "react";
import { KartleggingssporsmalTextFieldSnapshot } from "@/data/kartleggingssporsmal/kartleggingssporsmalSkjemasvarTypes";

interface Props {
  textSvar: KartleggingssporsmalTextFieldSnapshot;
}

export function KartleggingssporsmalTextSvar({ textSvar }: Props) {
  const isEmpty = !textSvar.value.trim();

  return (
    <Textarea
      label={textSvar.label}
      description={textSvar.description}
      value={isEmpty ? "Ingen tekst" : textSvar.value}
      size={"small"}
      readOnly={true}
      minRows={1}
      className={isEmpty ? "[&_textarea]:italic" : undefined}
    />
  );
}
