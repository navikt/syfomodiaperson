import React, { useState } from "react";
import { DatePicker, useDatepicker } from "@navikt/ds-react";

interface Props {
  fromDate: Date;
  toDate: Date;
  label: React.ReactNode;
  error?: string;
  defaultSelected: Date;
  onChange: (date: Date | undefined) => void;
}

export default function BoundedDatePicker({
  fromDate,
  toDate,
  label,
  error,
  defaultSelected,
  onChange,
}: Props) {
  const [internalError, setInternalError] = useState<string | undefined>();
  const { datepickerProps, inputProps } = useDatepicker({
    fromDate,
    toDate,
    defaultSelected,
    onDateChange: (date) => {
      setInternalError(undefined);
      onChange(date);
    },
  });

  return (
    <DatePicker {...datepickerProps} strategy="fixed" showWeekNumber>
      <DatePicker.Input
        {...inputProps}
        label={label}
        error={internalError ?? error}
        size={"small"}
      />
    </DatePicker>
  );
}
