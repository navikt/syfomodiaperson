import { TextFieldSnapshot } from "@/data/motebehov/types/motebehovTypes";
import { Textarea } from "@navikt/ds-react";
import React from "react";

interface Props {
  textSvar: TextFieldSnapshot;
}

export const TextSvar = ({ textSvar }: Props) => (
  <Textarea
    label={textSvar.label}
    value={textSvar.value}
    size={"small"}
    readOnly={true}
    minRows={1}
  />
);
