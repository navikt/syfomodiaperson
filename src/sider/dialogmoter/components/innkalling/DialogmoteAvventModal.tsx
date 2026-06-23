import React, { ReactElement } from "react";
import {
  BodyShort,
  Button,
  DatePicker,
  Modal,
  Textarea,
  useDatepicker,
} from "@navikt/ds-react";
import { useForm } from "react-hook-form";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { useAvventDialogmoteMutation } from "@/data/dialogmotekandidat/dialogmotekandidatQueryHooks";
import dayjs from "dayjs";
import { toDatePrettyPrint } from "@/utils/datoUtils";

const now = new Date();
const inThreeWeeks = dayjs(now).add(3, "weeks").toDate();
const inTwoMonths = dayjs(now).add(2, "months").toDate();

const texts = {
  header: "Avvent",
  body: "Informasjonen du oppgir her vil kun brukes til videre saksbehandling. Ingenting sendes videre til arbeidstaker eller arbeidsgiver.",
  deadlineDescription:
    "Det forventes at et meldt behov for et dialogmøte besvares innen rimelig tid. Det er derfor ikke mulig å avvente behandlingen av behovet mer enn 3 uker frem i tid.",
  begrunnelse: {
    label: "Beskrivelse",
    description: "Beskrivelse for årsaken til at dialogmøtet avventes",
    missing: "Begrunnelse mangler",
  },
  frist: {
    label: "Avventer til",
    description: "Velg frist for ny vurdering av dialogmøtebehov",
  },
  lagre: "Lagre",
  avbryt: "Avbryt",
};

const begrunnelseMaxLength = 300;

interface Props {
  isKandidat: boolean;
  isOpen: boolean;
  onClose: () => void;
}

interface SkjemaValues {
  begrunnelse?: string;
  frist: string;
}

export function DialogmoteAvventModal({
  isKandidat,
  isOpen,
  onClose,
}: Props): ReactElement {
  const avventMutation = useAvventDialogmoteMutation();

  const {
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SkjemaValues>();

  const deadline = isKandidat ? inTwoMonths : inThreeWeeks;
  const invalidDateMessage = (deadline: Date) =>
    `Vennligst angi en gyldig dato i intervallet ${toDatePrettyPrint(
      now,
    )} - ${toDatePrettyPrint(deadline)}`;

  const { datepickerProps, inputProps } = useDatepicker({
    onDateChange: (date) => {
      if (date) {
        setValue("frist", dayjs(date).format("YYYY-MM-DD"), {
          shouldValidate: true,
        });
      } else {
        setValue("frist", "", { shouldValidate: true });
      }
    },
    fromDate: now,
    toDate: deadline,
  });

  register("frist", {
    required: invalidDateMessage(deadline),
    validate: (value) => {
      if (!value) return invalidDateMessage(deadline);
      const selectedDate = dayjs(value).startOf("day");
      const maxDate = dayjs(deadline).startOf("day");
      const minDate = dayjs(now).startOf("day");
      if (selectedDate.isAfter(maxDate) || selectedDate.isBefore(minDate)) {
        return invalidDateMessage(deadline);
      }
      return true;
    },
  });

  const onSubmit = (values: SkjemaValues) => {
    const { begrunnelse, frist } = values;
    const isBlank = begrunnelse?.trim() === "";

    avventMutation.mutate(
      {
        frist,
        beskrivelse: isBlank ? undefined : begrunnelse,
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      closeOnBackdropClick
      aria-labelledby={texts.header}
      header={{ heading: texts.header }}
    >
      <Modal.Body className="min-w-[600px] p-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <BodyShort className="mb-2" size="small">
            {texts.body}
          </BodyShort>
          {!isKandidat && (
            <BodyShort className="mb-8" size="small">
              {texts.deadlineDescription}
            </BodyShort>
          )}

          <Textarea
            className="mb-4"
            {...register("begrunnelse", {
              maxLength: begrunnelseMaxLength,
              required: texts.begrunnelse.missing,
            })}
            value={watch("begrunnelse")}
            label={texts.begrunnelse.label}
            description={texts.begrunnelse.description}
            error={errors.begrunnelse && texts.begrunnelse.missing}
            size="small"
            minRows={6}
            maxLength={begrunnelseMaxLength}
          />

          <div className="mb-4">
            <DatePicker {...datepickerProps}>
              <DatePicker.Input
                {...inputProps}
                label={texts.frist.label}
                description={texts.frist.description}
                error={errors.frist?.message}
              />
            </DatePicker>
          </div>

          {avventMutation.isError && (
            <SkjemaInnsendingFeil error={avventMutation.error} />
          )}

          <div className="flex gap-4 mt-4">
            <Button loading={avventMutation.isPending} type="submit">
              {texts.lagre}
            </Button>
            <Button type="button" variant="tertiary" onClick={onClose}>
              {texts.avbryt}
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}
