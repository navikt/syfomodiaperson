import React from "react";
import { DatePicker, useDatepicker } from "@navikt/ds-react";
import { useController, useFormContext } from "react-hook-form";

const texts = {
  label: "Innstillingen gjelder fra",
  missingDate: "Vennligst angi dato",
};

interface Props {
  varselSvarfrist: Date;
}

export default function AvslagDatePicker({ varselSvarfrist }: Props) {
  const { control } = useFormContext();
  const { field, fieldState } = useController({
    name: "fom",
    control,
    rules: {
      required: texts.missingDate,
    },
  });
  const { datepickerProps, inputProps } = useDatepicker({
    fromDate: varselSvarfrist,
    onDateChange: field.onChange,
  });

  return (
    <DatePicker {...datepickerProps} strategy="fixed" showWeekNumber>
      <DatePicker.Input
        {...inputProps}
        size="small"
        label={texts.label}
        error={fieldState.error?.message}
      />
    </DatePicker>
  );
}
