import { Textarea } from "@navikt/ds-react";
import React from "react";
import { KartleggingssporsmalTextFieldSnapshot } from "@/data/kartleggingssporsmal/kartleggingssporsmalSkjemasvarTypes";

interface Props {
  textSvar: KartleggingssporsmalTextFieldSnapshot;
}

export const KartleggingssporsmalTextSvar = ({ textSvar }: Props) => (
  <Textarea
    label={textSvar.label}
    value={textSvar.value}
    size={"small"}
    readOnly={true}
    minRows={1}
  />
);
