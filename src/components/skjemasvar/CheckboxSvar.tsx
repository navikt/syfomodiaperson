import { Checkbox } from "@navikt/ds-react";
import React from "react";
import { SingleCheckboxFieldSnapshot } from "@/data/skjemasvar/types/SkjemasvarTypes";

interface Props {
  checkboxSvar: SingleCheckboxFieldSnapshot;
}

export const CheckboxSvar = ({ checkboxSvar }: Props) => (
  <Checkbox checked={checkboxSvar.value} size={"small"} readOnly={true}>
    {checkboxSvar.label}
  </Checkbox>
);
