import React, { useEffect } from "react";
import { Button, DatePicker, useRangeDatepicker } from "@navikt/ds-react";
import { PlusIcon, TrashIcon } from "@navikt/aksel-icons";
import { useController, useFieldArray, useFormContext } from "react-hook-form";
import { Periode } from "@/data/utenlandsopphold/utenlandsoppholdTypes.ts";
import { addDays } from "@/utils/datoUtils.ts";

const texts = {
  fomLabel: "Fra og med dato",
  tomLabel: "Til og med dato",
  missingPeriode: "Vennligst angi periode",
  periodeKryssesIkkeSoktePerioder:
    "Perioden kan ikke krysse datoer det ikke er søkt om",
  periodeOverlapperAnnenPeriode:
    "Perioden kan ikke overlappe med en annen periode du har lagt til",
  fjernPeriode: "Fjern periode",
  leggTilPeriode: "Legg til flere godkjente perioder",
};

interface Hull {
  from: Date;
  to: Date;
}

interface Props {
  soktePerioder: Periode[];
}

/**
 * En eller flere datepickere i range-modus for å velge de periodene som skal
 * delvis innvilges, innenfor de faktiske søkte periodene. Dager utenfor
 * `soktePerioder`, inkludert eventuelle "hull" mellom flere søkte perioder,
 * er deaktivert og kan ikke velges i kalenderen. I tillegg valideres hver
 * periode, slik at den heller ikke kan angis ved å skrive datoer direkte inn
 * i input-feltene, og slik at periodene brukeren legger til ikke kan
 * overlappe hverandre.
 */
export function DelvisInnvilgelsePeriodeDatepicker({ soktePerioder }: Props) {
  const { control, trigger } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "innvilgedePerioder",
  });

  // Vi legger til en rad med datepickers slik at brukeren alltid har minst én rad å fylle ut fra starten
  useEffect(() => {
    if (fields.length === 0) {
      append({ fom: undefined, tom: undefined });
    }
  }, [fields.length, append]);

  const sortertePerioder = [...soktePerioder].sort(
    (a, b) => a.fom.getTime() - b.fom.getTime(),
  );
  const fromDate = sortertePerioder[0].fom;
  const toDate = sortertePerioder[sortertePerioder.length - 1].tom;
  const hull = sortertePerioder
    .slice(1)
    .map((periode, index) => ({
      from: addDays(sortertePerioder[index].tom, 1),
      to: addDays(periode.fom, -1),
    }))
    // Hvis to søkte perioder ligger inntil hverandre uten noe faktisk hull
    // mellom seg, vil "from" bli senere enn "to" over. Denne må filtreres
    // bort, ellers vil den inverterte rangen feilaktig blokkere/validere
    // bort gyldige datoer som faktisk er dekket av de søkte periodene.
    .filter((periode) => periode.from <= periode.to);

  function revaliderAllePerioder() {
    trigger(
      fields.flatMap((_, index) => [
        `innvilgedePerioder.${index}.fom`,
        `innvilgedePerioder.${index}.tom`,
      ]),
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {fields.map((field, index) => (
        <DelvisInnvilgetPeriodeRad
          key={field.id}
          index={index}
          fromDate={fromDate}
          toDate={toDate}
          hull={hull}
          onPeriodeEndret={revaliderAllePerioder}
          onFjern={fields.length > 1 ? () => remove(index) : undefined}
        />
      ))}
      <div>
        <Button
          type="button"
          variant="tertiary"
          size="xsmall"
          icon={<PlusIcon title="Pluss ikon" />}
          onClick={() => append({ fom: undefined, tom: undefined })}
        >
          {texts.leggTilPeriode}
        </Button>
      </div>
    </div>
  );
}

interface RadProps {
  index: number;
  fromDate: Date;
  toDate: Date;
  hull: Hull[];
  onPeriodeEndret: () => void;
  onFjern?: () => void;
}

function DelvisInnvilgetPeriodeRad({
  index,
  fromDate,
  toDate,
  hull,
  onPeriodeEndret,
  onFjern,
}: RadProps) {
  const { control, getValues } = useFormContext();
  const fomName = `innvilgedePerioder.${index}.fom`;
  const tomName = `innvilgedePerioder.${index}.tom`;

  function krysserHull(fom?: Date, tom?: Date) {
    return (
      !!fom &&
      !!tom &&
      hull.some((periode) => fom <= periode.to && tom >= periode.from)
    );
  }

  function overlapperAnnenPeriode(fom?: Date, tom?: Date) {
    if (!fom || !tom) {
      return false;
    }
    const allePerioder: { fom?: Date; tom?: Date }[] =
      getValues("innvilgedePerioder") ?? [];
    return allePerioder.some(
      (periode, periodeIndex) =>
        periodeIndex !== index &&
        periode.fom &&
        periode.tom &&
        fom <= periode.tom &&
        periode.fom <= tom,
    );
  }

  function validerPeriode(fom?: Date, tom?: Date) {
    if (krysserHull(fom, tom)) {
      return texts.periodeKryssesIkkeSoktePerioder;
    }
    if (overlapperAnnenPeriode(fom, tom)) {
      return texts.periodeOverlapperAnnenPeriode;
    }
    return true;
  }

  const { field: fomField, fieldState: fomFieldState } = useController({
    name: fomName,
    control,
    rules: {
      required: texts.missingPeriode,
      validate: (fom: Date) => validerPeriode(fom, getValues(tomName)),
    },
  });
  const { field: tomField, fieldState: tomFieldState } = useController({
    name: tomName,
    control,
    rules: {
      required: texts.missingPeriode,
      validate: (tom: Date) => validerPeriode(getValues(fomName), tom),
    },
  });

  const { datepickerProps, fromInputProps, toInputProps } = useRangeDatepicker({
    fromDate,
    toDate,
    disabled: hull,
    onRangeChange: (range) => {
      fomField.onChange(range?.from);
      tomField.onChange(range?.to);
      onPeriodeEndret();
    },
  });

  return (
    <div className="flex flex-row items-end gap-4">
      <DatePicker {...datepickerProps} strategy="fixed" showWeekNumber>
        <div className="flex flex-row gap-4">
          <DatePicker.Input
            {...fromInputProps}
            label={texts.fomLabel}
            size="small"
            error={fomFieldState.error?.message}
          />
          <DatePicker.Input
            {...toInputProps}
            label={texts.tomLabel}
            size="small"
            error={tomFieldState.error?.message}
          />
        </div>
      </DatePicker>
      {onFjern && (
        <Button
          className="mb-1"
          type="button"
          variant="tertiary"
          size="small"
          icon={<TrashIcon title="Slett ikon" />}
          onClick={onFjern}
        />
      )}
    </div>
  );
}
