import { Radio, RadioGroup } from "@navikt/ds-react";
import React from "react";
import { KartleggingssporsmalRadioGroupFieldSnapshot } from "@/data/kartleggingssporsmal/kartleggingssporsmalSkjemasvarTypes";

interface Props {
  radioGroupSvar: KartleggingssporsmalRadioGroupFieldSnapshot;
}

export function KartleggingssporsmalRadioGroupSvar({ radioGroupSvar }: Props) {
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
