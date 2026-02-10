import React, { useCallback, useState } from "react";
import {
  Alert,
  BodyLong,
  Button,
  ErrorMessage,
  Heading,
  Modal,
  Select,
  Textarea,
} from "@navikt/ds-react";
import { useCreateOppfolgingsoppgave } from "@/data/oppfolgingsoppgave/useCreateOppfolgingsoppgave";
import {
  EditOppfolgingsoppgaveRequestDTO,
  Oppfolgingsgrunn,
  oppfolgingsgrunnToText,
  OppfolgingsoppgaveRequestDTO,
  OppfolgingsoppgaveResponseDTO,
} from "@/data/oppfolgingsoppgave/types";
import { FormProvider, useForm } from "react-hook-form";
import dayjs from "dayjs";
import { useEditOppfolgingsoppgave } from "@/data/oppfolgingsoppgave/useEditOppfolgingsoppgave";
import FristDatePicker from "@/components/oppfolgingsoppgave/FristDatePicker";
import { useFeatureToggles } from "@/data/unleash/unleashQueryHooks";

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
  lengthBeskrivelseAlert:
    "Husk at opplysninger som har betydning for saken skal journalføres i eget notat i Gosys.",
};

interface FormValues {
  oppfolgingsgrunn: Oppfolgingsgrunn;
  beskrivelse?: string;
  frist?: Date;
}

const MAX_LENGTH_BESKRIVELSE = 300;
const ALERT_LENGTH_BESKRIVELSE = 200;

interface Props {
  isOpen: boolean;
  toggleOpen: (value: boolean) => void;
  existingOppfolgingsoppgave?: OppfolgingsoppgaveResponseDTO;
}

export default function OppfolgingsoppgaveModal({
  isOpen,
  toggleOpen,
  existingOppfolgingsoppgave,
}: Props) {
  const { toggles } = useFeatureToggles();
  const [isFormError, setIsFormError] = useState(false);
  const createOppfolgingsoppgave = useCreateOppfolgingsoppgave();
  const editOppfolgingsoppgave = useEditOppfolgingsoppgave(
    existingOppfolgingsoppgave?.uuid
  );
  const existingOppfolgingsoppgaveVersjon =
    existingOppfolgingsoppgave?.versjoner?.[0];
  const formProps = useForm<FormValues>({
    defaultValues: existingOppfolgingsoppgaveVersjon && {
      beskrivelse: existingOppfolgingsoppgaveVersjon.tekst ?? "",
      frist: existingOppfolgingsoppgaveVersjon.frist
        ? dayjs(existingOppfolgingsoppgaveVersjon.frist).toDate()
        : undefined,
      oppfolgingsgrunn: existingOppfolgingsoppgaveVersjon.oppfolgingsgrunn,
    },
  });
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = formProps;
  const watchedValues = watch();
  const isEditMode = !!existingOppfolgingsoppgave;
  const isFormEdited = useCallback(
    (existingOppfolgingsoppgave: OppfolgingsoppgaveResponseDTO | undefined) => {
      const existingOppfolgingsoppgaveVersjon =
        existingOppfolgingsoppgave?.versjoner[0];
      const isOppfolgingsgrunnEdited =
        watchedValues.oppfolgingsgrunn !==
        existingOppfolgingsoppgaveVersjon?.oppfolgingsgrunn;
      const currentFrist = watchedValues.frist
        ? dayjs(watchedValues.frist).format("YYYY-MM-DD")
        : undefined;
      const existingFrist = existingOppfolgingsoppgaveVersjon?.frist;
      const isFristEdited = currentFrist !== existingFrist;

      const isBeskrivelseEdited =
        watchedValues.beskrivelse !== existingOppfolgingsoppgaveVersjon?.tekst;
      return isFristEdited || isBeskrivelseEdited || isOppfolgingsgrunnEdited;
    },
    [watchedValues]
  );

  const submit = (values: FormValues) => {
    if (isEditMode) {
      if (!isFormEdited(existingOppfolgingsoppgave)) {
        setIsFormError(true);
      } else {
        submitEditedOppfolgingsoppgave(values);
      }
    } else {
      submitNewOppfolgingsoppgave(values);
    }
  };

  function submitEditedOppfolgingsoppgave(values: FormValues) {
    const oppfolgingsoppgaveDto: EditOppfolgingsoppgaveRequestDTO = {
      oppfolgingsgrunn: values.oppfolgingsgrunn,
      tekst: values.beskrivelse,
      frist: dayjs(values.frist).format("YYYY-MM-DD"),
    };
    editOppfolgingsoppgave.mutate(oppfolgingsoppgaveDto, {
      onSuccess: () => toggleOpen(false),
    });
  }

  function submitNewOppfolgingsoppgave(values: FormValues) {
    const oppfolgingsoppgaveDto: OppfolgingsoppgaveRequestDTO = {
      oppfolgingsgrunn: values.oppfolgingsgrunn,
      tekst: values.beskrivelse,
      frist: dayjs(values.frist).format("YYYY-MM-DD"),
    };
    createOppfolgingsoppgave.mutate(oppfolgingsoppgaveDto, {
      onSuccess: () => toggleOpen(false),
    });
  }

  const defaultSelectedDate = !!existingOppfolgingsoppgaveVersjon?.frist
    ? dayjs(existingOppfolgingsoppgaveVersjon.frist).toDate()
    : undefined;

  const isOppfolgingsgrunnAnnet =
    watch("oppfolgingsgrunn") === Oppfolgingsgrunn.ANNET;

  const textareaValue = watch("beskrivelse");
  const textareaCount = textareaValue ? textareaValue.length : 0;

  return (
    <FormProvider {...formProps}>
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
              {Object.values(Oppfolgingsgrunn)
                .filter(
                  (oppfolgingsgrunn) =>
                    toggles.isForsokForsterketOppfolgingMerkingEnabled ||
                    oppfolgingsgrunn !==
                      Oppfolgingsgrunn.DELTAR_FORSOK_FORSTERKET_OPPFOLGING
                )
                .map((oppfolgingsgrunn, index) => (
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

            <FristDatePicker defaultSelectedDate={defaultSelectedDate} />
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
            {createOppfolgingsoppgave.isError && (
              <ErrorMessage>
                {createOppfolgingsoppgave.error.error.defaultErrorMsg}
              </ErrorMessage>
            )}
            {editOppfolgingsoppgave.isError && (
              <ErrorMessage>
                {editOppfolgingsoppgave.error.error.defaultErrorMsg}
              </ErrorMessage>
            )}
          </Modal.Footer>
        </Modal>
      </form>
    </FormProvider>
  );
}
