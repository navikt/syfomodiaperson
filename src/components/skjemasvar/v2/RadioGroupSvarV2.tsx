import { Radio, RadioGroup } from "@navikt/ds-react";
import React from "react";
import { RadioGroupFieldSnapshotV2 } from "@/data/skjemasvar/types/SkjemasvarTypes";

interface Props {
  radioGroupSvar: RadioGroupFieldSnapshotV2;
}

export function RadioGroupSvarV2({ radioGroupSvar }: Props) {
  const svar = radioGroupSvar.options.find((option) => option.wasSelected);

  return (
    <RadioGroup
      readOnly={true}
      legend={radioGroupSvar.label}
      value={svar?.optionId}
      size={"small"}
    >
      {radioGroupSvar.options.map((field, index) => (
        <Radio
          key={index}
          value={field.optionId}
          size={"small"}
          readOnly={true}
        >
          {field.optionLabel}
        </Radio>
      ))}
    </RadioGroup>
  );
}
