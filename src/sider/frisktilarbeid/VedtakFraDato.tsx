import React from "react";
import { DatePicker, useDatepicker } from "@navikt/ds-react";
import { useController } from "react-hook-form";
import dayjs from "dayjs";

const texts = {
  fraDatoMissing: "Vennligst angi dato",
  invalidFraDato: "Dato kan ikke være etter til-dato",
  fraDatoLabel: "Friskmeldingen gjelder fra",
  fraDatoDescription: "Datoen vedtaket starter",
};

interface VedtakFraDatoProps {
  tilDato: Date | undefined;
}

export const VedtakFraDato = ({ tilDato }: VedtakFraDatoProps) => {
  const { field, fieldState } = useController({
    name: "fraDato",
    rules: {
      validate: (value: Date | undefined) => {
        if (!value) {
          return texts.fraDatoMissing;
        }
        if (tilDato && dayjs(tilDato).isBefore(dayjs(value))) {
          return texts.invalidFraDato;
        }
      },
    },
  });
  const fraDatoDatePicker = useDatepicker({
    onDateChange: (date: Date | undefined) => field.onChange(date),
  });

  return (
    <DatePicker {...fraDatoDatePicker.datepickerProps} showWeekNumber>
      <DatePicker.Input
        {...fraDatoDatePicker.inputProps}
        label={texts.fraDatoLabel}
        description={texts.fraDatoDescription}
        error={fieldState.error?.message}
      />
    </DatePicker>
  );
};
