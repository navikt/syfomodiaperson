import { DatePicker, useDatepicker } from "@navikt/ds-react";
import { useController } from "react-hook-form";
import React from "react";
import { FormValues } from "@/sider/aktivitetskrav/vurdering/InnstillingOmStansSkjema";

const texts = {
  label: "Innstillingen gjelder fra",
  missingStansdatoError: "Vennligst angi dato for stans",
};

interface Props {
  varselSvarfrist: Date;
}

export function StansdatoDatePicker({ varselSvarfrist }: Props) {
  const { field, fieldState } = useController<FormValues, "stansFom">({
    name: "stansFom",
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
    <DatePicker {...datepickerProps} showWeekNumber>
      <DatePicker.Input
        {...inputProps}
        label={texts.label}
        error={fieldState.error?.message}
        size="small"
      />
    </DatePicker>
  );
}
