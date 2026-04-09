import { Textarea } from "@navikt/ds-react";
import React from "react";
import { KartleggingssporsmalTextFieldSnapshot } from "@/data/kartleggingssporsmal/kartleggingssporsmalSkjemasvarTypes";

interface Props {
  textSvar: KartleggingssporsmalTextFieldSnapshot;
}

export function KartleggingssporsmalTextSvar({ textSvar }: Props) {
  return (
    <Textarea
      label={textSvar.label}
      description={textSvar.description}
      value={textSvar.value}
      size={"small"}
      readOnly={true}
      minRows={1}
    />
  );
}
