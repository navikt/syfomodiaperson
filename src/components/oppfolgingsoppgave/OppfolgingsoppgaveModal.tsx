import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  BodyLong,
  Button,
  DatePicker,
  ErrorMessage,
  Heading,
  Modal,
  Select,
  Textarea,
  useDatepicker,
} from "@navikt/ds-react";
import { useCreateOppfolgingsoppgave } from "@/data/oppfolgingsoppgave/useCreateOppfolgingsoppgave";
import {
  EditOppfolgingsoppgaveRequestDTO,
  Oppfolgingsgrunn,
  oppfolgingsgrunnToText,
  OppfolgingsoppgaveRequestDTO,
  OppfolgingsoppgaveResponseDTO,
} from "@/data/oppfolgingsoppgave/types";
import { useForm } from "react-hook-form";
import * as Amplitude from "@/utils/amplitude";
import { EventType } from "@/utils/amplitude";
import dayjs from "dayjs";
import { useEditOppfolgingsoppgave } from "@/data/oppfolgingsoppgave/useEditOppfolgingsoppgave";

const texts = {
  header: "Oppfølgingsoppgave",
  description:
    "Du kan lage en oppfølgingsoppgave hvis du har behov for å følge opp den sykmeldte utenom de hendelsene Modia lager automatisk. Oppfølgingsbehovet må være hjemlet i folketrygdloven kapittel 8. Den sykmeldte kan kreve innsyn i oppfølgingsoppgavene.",
  annetChosenAlert:
    "Denne oppgaven skal kun brukes til sykefraværsoppfølging, altså ikke oppgaver knyttet til andre ytelser eller formål. Innbyggeren kan få innsyn i det du skriver her.",
  formNeedsChangeToSave: "Du må gjøre en endring før du kan lagre.",
  save: "Lagre",
  close: "Avbryt",
  missingOppfolgingsgrunn: "Vennligst angi oppfølgingsgrunn.",
  oppfolgingsgrunnLabel: "Hvilken oppfølgingsgrunn har du? (obligatorisk)",
  oppfolgingsgrunnDesc:
    "Velg den oppfølgingsgrunnen som passer med formålet for oppfølgingen.",
  oppfolgingsgrunnDefaultOption: "Velg oppfølgingsgrunn",
  beskrivelseLabel: "Beskrivelse",
  datepickerLabel: "Frist",
  lengthBeskrivelseAlert:
    "Husk at opplysninger som har betydning for saken skal journalføres i eget notat i Gosys.",
};

interface FormValues {
  oppfolgingsgrunn: Oppfolgingsgrunn;
  beskrivelse?: string;
  frist: string | null;
}

interface Props {
  isOpen: boolean;
  toggleOpen: (value: boolean) => void;
  existingOppfolgingsoppgave?: OppfolgingsoppgaveResponseDTO;
}

const MAX_LENGTH_BESKRIVELSE = 300;
const ALERT_LENGTH_BESKRIVELSE = 200;

function logOppfolgingsgrunnSendt(oppfolgingsgrunn: Oppfolgingsgrunn) {
  Amplitude.logEvent({
    type: EventType.OppfolgingsgrunnSendt,
    data: {
      url: window.location.href,
      oppfolgingsgrunn: oppfolgingsgrunn,
    },
  });
}
function logOppfolgingsoppgaveEdited(
  oppfolgingsgrunn: Oppfolgingsgrunn,
  existingOppfolgingsoppgave: OppfolgingsoppgaveResponseDTO,
  editedOppfolgingsoppgave: EditOppfolgingsoppgaveRequestDTO
) {
  const existingOppfolgingsoppgaveVersjon =
    existingOppfolgingsoppgave.versjoner[0];
  const existingOppfolgingsgrunn =
    existingOppfolgingsoppgaveVersjon?.oppfolgingsgrunn;
  if (oppfolgingsgrunn !== existingOppfolgingsgrunn) {
    Amplitude.logEvent({
      type: EventType.OppfolgingsgrunnEdited,
      data: {
        url: window.location.href,
        oldOppfolgingsgrunn: existingOppfolgingsgrunn,
        newOppfolgingsgrunn: oppfolgingsgrunn,
      },
    });
  } else {
    const editedFields: string[] = [];
    if (
      editedOppfolgingsoppgave.frist !==
      existingOppfolgingsoppgaveVersjon?.frist
    ) {
      editedFields.push("frist");
    }
    if (
      editedOppfolgingsoppgave.tekst !==
      existingOppfolgingsoppgaveVersjon?.tekst
    ) {
      editedFields.push("tekst");
    }
    Amplitude.logEvent({
      type: EventType.OppfolgingsoppgaveEdited,
      data: {
        url: window.location.href,
        oppfolgingsgrunn: oppfolgingsgrunn,
        fieldsEdited: editedFields,
      },
    });
  }
}

export const OppfolgingsoppgaveModal = ({
  isOpen,
  toggleOpen,
  existingOppfolgingsoppgave,
}: Props) => {
  const [isFormError, setIsFormError] = useState(false);
  const [isFristTouched, setIsFristTouched] = useState(false);
  const createOppfolgingsoppgave = useCreateOppfolgingsoppgave();
  const editOppfolgingsoppgave = useEditOppfolgingsoppgave(
    existingOppfolgingsoppgave?.uuid
  );
  const existingOppfolgingsoppgaveVersjon =
    existingOppfolgingsoppgave?.versjoner?.[0];
  const {
    register,
    formState: { errors, isDirty },
    handleSubmit,
    setValue,
    watch,
  } = useForm<FormValues>({
    defaultValues: existingOppfolgingsoppgaveVersjon && {
      beskrivelse: existingOppfolgingsoppgaveVersjon.tekst ?? "",
      frist: existingOppfolgingsoppgaveVersjon.frist,
      oppfolgingsgrunn: existingOppfolgingsoppgaveVersjon.oppfolgingsgrunn,
    },
  });
  const watchedValues = watch();
  const isEditMode = !!existingOppfolgingsoppgave;
  const isFormEdited = useCallback(
    (existingOppfolgingsoppgave: OppfolgingsoppgaveResponseDTO | undefined) => {
      const existingOppfolgingsoppgaveVersjon =
        existingOppfolgingsoppgave?.versjoner[0];
      const isOppfolgingsgrunnEdited =
        watchedValues.oppfolgingsgrunn !==
        existingOppfolgingsoppgaveVersjon?.oppfolgingsgrunn;
      const isFristEdited =
        watchedValues.frist !== existingOppfolgingsoppgaveVersjon?.frist;
      const isBeskrivelseEdited =
        watchedValues.beskrivelse !== existingOppfolgingsoppgaveVersjon?.tekst;
      return isFristEdited || isBeskrivelseEdited || isOppfolgingsgrunnEdited;
    },
    [watchedValues]
  );

  useEffect(() => {
    if (isDirty || isFristTouched) {
      setIsFormError(!isFormEdited(existingOppfolgingsoppgave));
    }
  }, [
    existingOppfolgingsoppgave,
    isDirty,
    isFormEdited,
    isFristTouched,
    watchedValues,
  ]);

  const submit = (values: FormValues) => {
    if (isEditMode) {
      if (!isFormEdited(existingOppfolgingsoppgave)) {
        setIsFormError(true);
      } else {
        submitEditedOppfolgingsoppgave(values, existingOppfolgingsoppgave);
      }
    } else {
      submitNewOppfolgingsoppgave(values);
    }
  };

  function submitEditedOppfolgingsoppgave(
    values: FormValues,
    existingOppfolgingsoppgave: OppfolgingsoppgaveResponseDTO
  ) {
    const { beskrivelse, frist, oppfolgingsgrunn } = values;
    const oppfolgingsoppgaveDto: EditOppfolgingsoppgaveRequestDTO = {
      oppfolgingsgrunn: oppfolgingsgrunn,
      tekst: beskrivelse,
      frist: frist,
    };
    editOppfolgingsoppgave.mutate(oppfolgingsoppgaveDto, {
      onSuccess: () => {
        logOppfolgingsoppgaveEdited(
          oppfolgingsgrunn,
          existingOppfolgingsoppgave,
          oppfolgingsoppgaveDto
        );
        toggleOpen(false);
      },
    });
  }

  function submitNewOppfolgingsoppgave(values: FormValues) {
    const oppfolgingsoppgaveDto: OppfolgingsoppgaveRequestDTO = {
      oppfolgingsgrunn: values.oppfolgingsgrunn,
      tekst: values.beskrivelse,
      frist: values.frist,
    };
    createOppfolgingsoppgave.mutate(oppfolgingsoppgaveDto, {
      onSuccess: () => {
        logOppfolgingsgrunnSendt(values.oppfolgingsgrunn);
        toggleOpen(false);
      },
    });
  }

  const defaultSelectedDate = existingOppfolgingsoppgaveVersjon?.frist
    ? dayjs(existingOppfolgingsoppgaveVersjon.frist).toDate()
    : undefined;
  const { datepickerProps, inputProps } = useDatepicker({
    onDateChange: (date: Date | undefined) => {
      date
        ? setValue("frist", dayjs(date).format("YYYY-MM-DD"))
        : setValue("frist", null);
      setIsFristTouched(true);
    },
    defaultSelected: defaultSelectedDate,
    fromDate: new Date(),
  });

  const isOppfolgingsgrunnAnnet =
    watch("oppfolgingsgrunn") === Oppfolgingsgrunn.ANNET;

  const textareaValue = watch("beskrivelse");
  const textareaCount = textareaValue ? textareaValue.length : 0;

  return (
    <form onSubmit={handleSubmit(submit)}>
      <Modal
        closeOnBackdropClick
        className="px-6 py-4 w-full max-w-[50rem]"
        aria-label={texts.header}
        open={isOpen}
        onClose={() => toggleOpen(false)}
      >
        <Modal.Header className="mb-4">
          <div className={"flex items-center mb-4"}>
            <Heading
              level="1"
              size="medium"
              id="modal-heading"
              className={"mr-2"}
            >
              {texts.header}
            </Heading>
          </div>
          <BodyLong size="small">{texts.description}</BodyLong>
        </Modal.Header>

        <Modal.Body className={"flex flex-col gap-4"}>
          <Select
            label={texts.oppfolgingsgrunnLabel}
            description={texts.oppfolgingsgrunnDesc}
            size="small"
            className="w-[24rem]"
            {...register("oppfolgingsgrunn", { required: true })}
            error={errors.oppfolgingsgrunn && texts.missingOppfolgingsgrunn}
            value={watch("oppfolgingsgrunn")}
          >
            <option value="">{texts.oppfolgingsgrunnDefaultOption}</option>
            {Object.values(Oppfolgingsgrunn).map((oppfolgingsgrunn, index) => (
              <option key={index} value={oppfolgingsgrunn}>
                {oppfolgingsgrunnToText[oppfolgingsgrunn]}
              </option>
            ))}
          </Select>

          {isOppfolgingsgrunnAnnet && (
            <Alert inline variant="warning">
              <BodyLong textColor="subtle" size="small">
                {texts.annetChosenAlert}
              </BodyLong>
            </Alert>
          )}

          <Textarea
            label={texts.beskrivelseLabel}
            size="small"
            value={watch("beskrivelse")}
            maxLength={MAX_LENGTH_BESKRIVELSE}
            {...register("beskrivelse", {
              maxLength: MAX_LENGTH_BESKRIVELSE,
            })}
          ></Textarea>

          {textareaCount >= ALERT_LENGTH_BESKRIVELSE && (
            <Alert inline variant="warning">
              <BodyLong textColor="subtle" size="small">
                {texts.lengthBeskrivelseAlert}
              </BodyLong>
            </Alert>
          )}

          <DatePicker {...datepickerProps} strategy="fixed">
            <DatePicker.Input {...inputProps} label={texts.datepickerLabel} />
          </DatePicker>
        </Modal.Body>

        <Modal.Footer>
          <Button
            type="button"
            variant="secondary"
            onClick={() => toggleOpen(false)}
          >
            {texts.close}
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={
              createOppfolgingsoppgave.isPending ||
              editOppfolgingsoppgave.isPending
            }
          >
            {texts.save}
          </Button>
          {isFormError && (
            <ErrorMessage>{texts.formNeedsChangeToSave}</ErrorMessage>
          )}
        </Modal.Footer>
      </Modal>
    </form>
  );
};
