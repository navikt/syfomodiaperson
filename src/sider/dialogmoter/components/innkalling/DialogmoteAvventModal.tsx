import React, { ReactElement } from "react";
import {
  Modal,
  Button,
  Textarea,
  BodyShort,
  DatePicker,
  useDatepicker,
} from "@navikt/ds-react";
import { useForm } from "react-hook-form";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { useAvventDialogmoteMutation } from "@/data/dialogmotekandidat/dialogmotekandidatQueryHooks";
import dayjs from "dayjs";
import { toDatePrettyPrint } from "@/utils/datoUtils";

const now = new Date();
const inTwoMonths = dayjs(now).add(2, "months").toDate();
const invalidDateMessage = `Vennligst angi en gyldig dato innen ${toDatePrettyPrint(
  inTwoMonths
)}`;

const texts = {
  header: "Avvent",
  body: "Informasjonen du oppgir her vil kun brukes til videre saksbehandling. Ingenting sendes videre til arbeidstaker eller arbeidsgiver.",
  begrunnelse: {
    label: "Beskrivelse",
    description: "Beskrivelse for årsaken til at dialogmøtet avventes",
    missing: "Begrunnelse mangler",
  },
  frist: {
    label: "Avventer til",
    description: "Velg frist for ny vurdering av dialogmøtebehov",
    missing: invalidDateMessage,
  },
  lagre: "Lagre",
  avbryt: "Avbryt",
};

const begrunnelseMaxLength = 200;

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface SkjemaValues {
  begrunnelse?: string;
  frist: string;
}

export function DialogmoteAvventModal({
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
    toDate: inTwoMonths,
  });

  const onSubmit = (values: SkjemaValues) => {
    const { begrunnelse, frist } = values;
    const isBlank = begrunnelse?.trim() === "";

    if (!frist) {
      return;
    }

    avventMutation.mutate(
      {
        frist,
        beskrivelse: isBlank ? undefined : begrunnelse,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
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
          <BodyShort className="mb-8" size="small">
            {texts.body}
          </BodyShort>

          <Textarea
            className="mb-4"
            {...register("begrunnelse", {
              maxLength: begrunnelseMaxLength,
            })}
            {...register("begrunnelse", {
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
                {...register("frist", { required: texts.frist.missing })}
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
