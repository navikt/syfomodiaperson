import { DatePicker, useDatepicker } from "@navikt/ds-react";
import { useController, useFormContext } from "react-hook-form";
import React from "react";

const texts = {
  label: "Frist (obligatorisk)",
  missingFristError: "Vennligst angi frist",
};

interface Props {
  defaultSelectedDate?: Date;
}

export default function FristDatePicker({ defaultSelectedDate }: Props) {
  const { control } = useFormContext();
  const { field, fieldState } = useController({
    name: "frist",
    control,
    rules: {
      required: texts.missingFristError,
    },
  });

  const { datepickerProps, inputProps } = useDatepicker({
    fromDate: new Date(),
    defaultSelected: defaultSelectedDate,
    onDateChange: field.onChange,
  });

  return (
    <DatePicker {...datepickerProps} strategy="fixed" showWeekNumber>
      <DatePicker.Input
        {...inputProps}
        label={texts.label}
        error={fieldState.error?.message}
        size="small"
      />
    </DatePicker>
  );
}
