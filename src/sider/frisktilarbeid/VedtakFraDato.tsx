import React, { useState } from "react";
import {
  DatePicker,
  type DateValidationT,
  useDatepicker,
} from "@navikt/ds-react";
import { useController } from "react-hook-form";
import dayjs from "dayjs";

const texts = {
  fraDatoMissing: "Vennligst angi dato",
  invalidFraDato: "Dato kan ikke være etter til-dato",
  beforeArbeidssokerFom: "Dato kan ikke være før arbeidssøkerperioden startet",
  fraDatoLabel: "Vedtaket gjelder fra",
  fraDatoDescription: "Må starte innenfor arbeidssøkerperioden",
};

interface Props {
  tilDato: Date | undefined;
  arbeidssokerFom: string;
}

export default function VedtakFraDato({ tilDato, arbeidssokerFom }: Props) {
  const [datepickerError, setDatepickerError] = useState<string>();
  const { field, fieldState } = useController({
    name: "fraDato",
    rules: {
      validate: (value: Date | undefined) => {
        if (!value) {
          return texts.fraDatoMissing;
        }
        if (dayjs(value).isBefore(dayjs(arbeidssokerFom), "day")) {
          return texts.beforeArbeidssokerFom;
        }
        if (tilDato && dayjs(tilDato).isBefore(dayjs(value))) {
          return texts.invalidFraDato;
        }
      },
    },
  });
  const fraDatoDatePicker = useDatepicker({
    fromDate: dayjs(arbeidssokerFom).toDate(),
    onDateChange: (date: Date | undefined) => field.onChange(date),
    onValidate: (validation: DateValidationT) => {
      setDatepickerError(
        validation.isBefore ? texts.beforeArbeidssokerFom : undefined,
      );
    },
  });

  return (
    <DatePicker {...fraDatoDatePicker.datepickerProps} showWeekNumber>
      <DatePicker.Input
        {...fraDatoDatePicker.inputProps}
        label={texts.fraDatoLabel}
        description={texts.fraDatoDescription}
        error={datepickerError ?? fieldState.error?.message}
      />
    </DatePicker>
  );
}
