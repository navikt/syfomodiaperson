import React from "react";
import { DatePicker, useDatepicker } from "@navikt/ds-react";
import { useController, useFormContext } from "react-hook-form";
import { VurderingArsak } from "@/sider/arbeidsuforhet/data/arbeidsuforhetTypes";

const texts = {
  label: "Når sendte NAY oppgaven i GOSYS? (obligatorisk)",
  required: "Vennligst angi dato oppgaven ble sendt fra NAY",
};

export default function OppgaveSendtFraNayDatepicker() {
  const { control, watch } = useFormContext();
  const { field, fieldState } = useController({
    name: "oppgaveFraNayDato",
    control,
    rules: {
      required: watch("arsak") === VurderingArsak.NAY_BER_OM_NY_VURDERING,
    },
  });
  const { datepickerProps, inputProps } = useDatepicker({
    onDateChange: field.onChange,
    defaultSelected: field.value,
    toDate: new Date(),
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
