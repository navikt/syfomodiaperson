import React, { ReactNode } from "react";
import {
  Alert,
  Box,
  Button,
  DatePicker,
  Heading,
  HelpText,
  Textarea,
  useDatepicker,
  VStack,
} from "@navikt/ds-react";
import { Forhandsvisning } from "@/components/Forhandsvisning";
import { FormProvider, useForm } from "react-hook-form";
import { VedtakFraDato } from "@/sider/frisktilarbeid/VedtakFraDato";
import { addDays, addWeeks } from "@/utils/datoUtils";
import { useFattVedtak } from "@/data/frisktilarbeid/useFattVedtak";
import { VedtakRequestDTO } from "@/data/frisktilarbeid/frisktilarbeidTypes";
import dayjs from "dayjs";
import { useFriskmeldingTilArbeidsformidlingDocument } from "@/hooks/frisktilarbeid/useFriskmeldingTilArbeidsformidlingDocument";
import { useMaksdatoQuery } from "@/data/maksdato/useMaksdatoQuery";
import { useNotification } from "@/context/notification/NotificationContext";

const begrunnelseMaxLength = 5000;

const texts = {
  header: "Fatt vedtak",
  begrunnelse: {
    missing: "Vennligst angi begrunnelse",
    label: "Begrunnelse",
    description: "Åpne forhåndsvisning for å se hele vedtaket",
    defaultValue:
      "Du er for tiden sykmeldt og alle muligheter er prøvd for at du kan komme tilbake til arbeidsplassen din. Du har valgt å avslutte denne jobben for å benytte deg av ordningen friskmelding til arbeidsformidling.",
  },
  previewContentLabel: "Forhåndsvis vedtaket",
  primaryButton: "Fatt vedtak",
  tilDatoLabel: "Til dato",
  tilDatoDescription: (tilDatoIsMaxDato: boolean) =>
    tilDatoIsMaxDato
      ? "Automatisk justert til maksdato"
      : "Automatisk justert 12 uker frem",
  tilDatoHelpText: "Dette er datoen vedtaket slutter",
  maksdatoWarning: (dato: string) =>
    `Foreløpig beregnet maksdato er tidligere enn 12 uker frem: ${dato}`,
  submittedAlert:
    "Vedtaket om friskmelding til arbeidsformidling fattet og sendt til bruker. Ny oppgave er lagt til i oversikten din.",
  fattVedtakErrorMessage:
    "Det oppstod en feil. Sjekk at sykmeldt er registrert som arbeidssøker og at perioden ikke overlapper med et eksisterende vedtak.",
};

function calculateTomDate(fomDato: Date, maksDato: Date | undefined): Date {
  // Ettersom det er til-og-med dato, trekker vi fra en dag
  const twelveWeeksFromFomDato = addWeeks(fomDato, 12);
  const tomDato = addDays(twelveWeeksFromFomDato, -1);
  if (!maksDato || dayjs(tomDato).isBefore(dayjs(maksDato))) {
    return tomDato;
  } else {
    return maksDato;
  }
}

function DatepickerLabel(): ReactNode {
  return (
    <>
      {texts.tilDatoLabel}
      <HelpText className="ml-2" placement="right">
        {texts.tilDatoHelpText}
      </HelpText>
    </>
  );
}

interface FormValues {
  fraDato: Date;
  begrunnelse: string;
}

export default function FattVedtakSkjema() {
  const fattVedtak = useFattVedtak();
  const { getVedtakDocument } = useFriskmeldingTilArbeidsformidlingDocument();
  const { data: maksDato } = useMaksdatoQuery();
  const { setNotification } = useNotification();
  const methods = useForm<FormValues>({
    defaultValues: { begrunnelse: texts.begrunnelse.defaultValue },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    getValues,
  } = methods;

  const fraDato: Date | undefined = watch("fraDato");
  const tilDato = fraDato
    ? calculateTomDate(fraDato, maksDato?.maxDate?.forelopig_beregnet_slutt)
    : undefined;

  const tilDatoIsMaxDato =
    !!tilDato &&
    dayjs(tilDato).isSame(dayjs(maksDato?.maxDate?.forelopig_beregnet_slutt));

  const submit = (values: FormValues) => {
    const vedtakRequestDTO: VedtakRequestDTO = {
      fom: dayjs(values.fraDato).format("YYYY-MM-DD"),
      tom: dayjs(tilDato).format("YYYY-MM-DD"),
      begrunnelse: values.begrunnelse,
      document: getVedtakDocument({
        fom: values.fraDato,
        tom: tilDato,
        begrunnelse: values.begrunnelse,
        tilDatoIsMaxDato,
      }),
    };

    fattVedtak.mutate(vedtakRequestDTO, {
      onSuccess: () =>
        setNotification({
          message: texts.submittedAlert,
          variant: "success",
        }),
    });
  };

  const tilDatoDatePicker = useDatepicker();

  return (
    <Box
      background="surface-default"
      padding="6"
      className="flex flex-col [&>*]:mb-4"
    >
      <Heading level="2" size="medium" className="mb-1">
        {texts.header}
      </Heading>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-8">
          <div className="flex flex-col gap-6">
            <VedtakFraDato tilDato={tilDato} />
            <VStack gap="2">
              <DatePicker {...tilDatoDatePicker.datepickerProps}>
                <DatePicker.Input
                  value={tilDato ? dayjs(tilDato).format("DD.MM.YYYY") : ""}
                  label={<DatepickerLabel />}
                  description={texts.tilDatoDescription(tilDatoIsMaxDato)}
                  readOnly
                />
              </DatePicker>
              {tilDatoIsMaxDato && (
                <Alert variant="warning" size="small" className="w-fit">
                  {texts.maksdatoWarning(dayjs(tilDato).format("DD.MM.YYYY"))}
                </Alert>
              )}
            </VStack>
            <Textarea
              {...register("begrunnelse", {
                required: texts.begrunnelse.missing,
                maxLength: begrunnelseMaxLength,
              })}
              value={watch("begrunnelse")}
              minRows={6}
              maxLength={begrunnelseMaxLength}
              description={texts.begrunnelse.description}
              label={texts.begrunnelse.label}
              error={errors.begrunnelse?.message}
            />
          </div>
          {fattVedtak.isError && (
            <Alert variant="error" size="small" contentMaxWidth={false}>
              {texts.fattVedtakErrorMessage}
            </Alert>
          )}
          <div className="flex gap-4">
            <Button
              variant="primary"
              loading={fattVedtak.isPending}
              type="submit"
            >
              {texts.primaryButton}
            </Button>
            <Forhandsvisning
              contentLabel={texts.previewContentLabel}
              getDocumentComponents={() =>
                getVedtakDocument({
                  fom: fraDato,
                  tom: tilDato,
                  begrunnelse: getValues("begrunnelse"),
                  tilDatoIsMaxDato,
                })
              }
            />
          </div>
        </form>
      </FormProvider>
    </Box>
  );
}
