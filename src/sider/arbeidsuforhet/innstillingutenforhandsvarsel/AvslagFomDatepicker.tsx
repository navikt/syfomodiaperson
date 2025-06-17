import { useController, useFormContext } from "react-hook-form";
import { DatePicker, useDatepicker } from "@navikt/ds-react";
import React from "react";

const texts = {
  label: "Vilkåret er ikke oppfylt fra og med dato (obligatorisk)",
  required: "Vennligst angi dato",
};

export default function AvslagFomDatepicker() {
  const { control } = useFormContext();
  const { field, fieldState } = useController({
    name: "avslagFom",
    control,
    rules: {
      required: true,
    },
  });

  const { datepickerProps, inputProps } = useDatepicker({
    onDateChange: field.onChange,
    defaultSelected: field.value,
  });

  return (
    <DatePicker {...datepickerProps} showWeekNumber>
      <DatePicker.Input
        {...inputProps}
        label={texts.label}
        size="small"
        error={fieldState.error && texts.required}
      />
    </DatePicker>
  );
}
