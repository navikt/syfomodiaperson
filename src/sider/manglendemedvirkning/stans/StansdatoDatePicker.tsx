import { DatePicker, useDatepicker } from "@navikt/ds-react";
import { useController } from "react-hook-form";
import React from "react";
import { StansSkjemaValues } from "@/sider/manglendemedvirkning/stans/StansSkjema";

const texts = {
  label: "Velg dato for stans (obligatorisk)",
  description: "Første mulige dato for stans er svarfristen i forhåndsvarselet",
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
        label={texts.label}
        description={texts.description}
        error={fieldState.error?.message}
        size="small"
      />
    </DatePicker>
  );
}
