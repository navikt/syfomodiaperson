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
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { useSettDialogmoteIkkeAktuell } from "@/sider/dialogmoter/hooks/useSettDialogmoteIkkeAktuell";
import {
  CreateIkkeAktuellDTO,
  IkkeAktuellArsak,
} from "@/data/dialogmotekandidat/types/dialogmoteikkeaktuellTypes";

const texts = {
  header: "Avvent",
  body: "Informasjonen du oppgir her vil kun brukes til videre saksbehandling. Ingenting sendes videre til arbeidstaker eller arbeidsgiver.",
  begrunnelse: {
    label: "Beskrivelse",
    description: "Beskrivelse for årsaken til at dialogmøtet avventes",
  },
  frist: {
    label: "Avventer til",
    description: "Velg frist for ny vurdering av dialogmøtebehov",
    missing: "Vennligst angi frist",
  },
  lagre: "Lagre",
  avbryt: "Avbryt",
};

const begrunnelseMaxLength = 1000;

interface DialogmoteAvventModalProps {
  open: boolean;
  onClose: () => void;
}

interface SkjemaValues {
  begrunnelse?: string;
  frist?: string;
}

export const DialogmoteAvventModal = ({
  open,
  onClose,
}: DialogmoteAvventModalProps): ReactElement => {
  const personIdent = useValgtPersonident();
  const settDialogmoteAvvent = useSettDialogmoteIkkeAktuell();

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
        setValue("frist", date.toISOString().substring(0, 10), {
          shouldValidate: true,
        });
      } else {
        setValue("frist", undefined, { shouldValidate: true });
      }
    },
  });

  const onSubmit = (values: SkjemaValues) => {
    const { begrunnelse, frist } = values;
    const isBlank = begrunnelse?.trim() === "";

    const dto: CreateIkkeAktuellDTO & { frist?: string } = {
      personIdent,
      // Use a fixed årsak since we don't show a choice in this Avvent modal
      arsak: IkkeAktuellArsak.DIALOGMOTE_AVHOLDT,
      beskrivelse: isBlank ? undefined : begrunnelse,
      frist,
    };

    settDialogmoteAvvent.mutate(dto, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Modal
      open={open}
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
            value={watch("begrunnelse")}
            label={texts.begrunnelse.label}
            description={texts.begrunnelse.description}
            error={errors.begrunnelse && ""}
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
                error={errors.frist && texts.frist.missing}
              />
            </DatePicker>
          </div>

          {settDialogmoteAvvent.isError && (
            <SkjemaInnsendingFeil error={settDialogmoteAvvent.error} />
          )}

          <div className="flex gap-4 mt-4">
            <Button loading={settDialogmoteAvvent.isPending} type="submit">
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
};
