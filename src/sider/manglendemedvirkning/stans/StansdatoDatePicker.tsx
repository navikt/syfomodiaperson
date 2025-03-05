import { DatePicker, Label, useDatepicker } from "@navikt/ds-react";
import { useController } from "react-hook-form";
import React from "react";
import { StansSkjemaValues } from "@/sider/manglendemedvirkning/stans/StansSkjema";

const texts = {
  label: "Innstillingen gjelder fra",
  missingStansdatoError: "Du må velge en dato",
};

interface Props {
  varselSvarfrist: Date;
}

export function StansdatoDatePicker({ varselSvarfrist }: Props) {
  const { field, fieldState } = useController<StansSkjemaValues, "stansdato">({
    name: "stansdato",
    rules: {
      required: texts.missingStansdatoError,
    },
  });
  const { datepickerProps, inputProps } = useDatepicker({
    fromDate: varselSvarfrist,
    onDateChange: (date: Date | undefined) => {
      field.onChange(date);
    },
  });

  return (
    <DatePicker {...datepickerProps}>
      <DatePicker.Input
        {...inputProps}
        label={<Label className={"text-lg"}>{texts.label}</Label>}
        error={fieldState.error?.message}
        size="medium"
        className={"[&_input]:rounded-lg"}
      />
    </DatePicker>
  );
}
