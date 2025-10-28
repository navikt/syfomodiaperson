import { Checkbox } from "@navikt/ds-react";
import React from "react";
import { KartleggingssporsmalSingleCheckboxFieldSnapshot } from "@/data/kartleggingssporsmal/kartleggingssporsmalSkjemasvarTypes";

interface Props {
  checkboxSvar: KartleggingssporsmalSingleCheckboxFieldSnapshot;
}

export const KartleggingssporsmalCheckboxSvar = ({ checkboxSvar }: Props) => (
  <Checkbox checked={checkboxSvar.value} size={"small"} readOnly={true}>
    {checkboxSvar.label}
  </Checkbox>
);
