import { Radio, RadioGroup } from "@navikt/ds-react";

import { RadioGroupFieldSnapshot } from "@/data/skjemasvar/types/SkjemasvarTypes";

interface Props {
  radioGroupSvar: RadioGroupFieldSnapshot;
}

export const RadioGroupSvar = ({ radioGroupSvar }: Props) => (
  <RadioGroup
    readOnly={true}
    legend={radioGroupSvar.label}
    value={radioGroupSvar.selectedOptionId}
    size={"small"}
  >
    {radioGroupSvar.options.map((field, index) => (
      <Radio key={index} value={field.optionId} size={"small"} readOnly={true}>
        {field.optionLabel}
      </Radio>
    ))}
  </RadioGroup>
);
