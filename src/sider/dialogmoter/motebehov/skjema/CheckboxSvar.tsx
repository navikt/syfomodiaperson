import { SingleCheckboxFieldSnapshot } from "@/data/motebehov/types/motebehovTypes";
import { Checkbox } from "@navikt/ds-react";
import React from "react";

interface Props {
  checkboxSvar: SingleCheckboxFieldSnapshot;
}

export const CheckboxSvar = ({ checkboxSvar }: Props) => (
  <Checkbox checked={checkboxSvar.value} size={"small"} readOnly={true}>
    {checkboxSvar.fieldLabel}
  </Checkbox>
);
