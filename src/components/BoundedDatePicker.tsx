import React, { useState } from "react";
import { DatePicker, useDatepicker } from "@navikt/ds-react";
import { toDateOnly } from "@/utils/datoUtils";

export interface BoundedDatePickerProps {
  fromDate: Date;
  toDate: Date;
  label: React.ReactNode;
  size?: "medium" | "small";
  error?: string;
  validationMessage: string;
  defaultSelected?: Date;
  onChange: (date: Date | undefined) => void;
}

export function BoundedDatePicker({
  fromDate,
  toDate,
  label,
  size = "small",
  error,
  validationMessage,
  defaultSelected,
  onChange,
}: BoundedDatePickerProps) {
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

  const handleDateSelectedOrEdited: React.FocusEventHandler<
    HTMLInputElement
  > = (e) => {
    const raw = e.target.value.trim();
    if (!raw) {
      onChange(undefined);
      setInternalError(validationMessage);
      return;
    }

    let parsed: Date | null = null;
    const ddMmYyyy = raw.match(/^(\d{2})[.](\d{2})[.](\d{4})$/);
    if (ddMmYyyy) {
      const [, d, m, y] = ddMmYyyy;
      parsed = new Date(Number(y), Number(m) - 1, Number(d));
    }
    if (!parsed || isNaN(parsed.getTime())) {
      onChange(undefined);
      setInternalError("Ugyldig datoformat. Bruk dd.mm.åååå");
      return;
    }

    const minDay = toDateOnly(fromDate);
    const maxDay = toDateOnly(toDate);
    const parsedDay = toDateOnly(parsed);

    if (parsedDay < minDay || parsedDay > maxDay) {
      onChange(undefined);
      setInternalError(validationMessage);
      return;
    }

    setInternalError(undefined);
    onChange(parsedDay);
  };

  return (
    <DatePicker {...datepickerProps} strategy="fixed" showWeekNumber>
      <DatePicker.Input
        {...inputProps}
        label={label}
        error={internalError ?? error}
        size={size}
        onBlur={handleDateSelectedOrEdited}
      />
    </DatePicker>
  );
}
