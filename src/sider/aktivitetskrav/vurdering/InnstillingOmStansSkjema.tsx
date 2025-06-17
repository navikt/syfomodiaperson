import {
  AktivitetskravStatus,
  InnstillingOmStansVurderingDTO,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import React from "react";
import { useVurderAktivitetskrav } from "@/data/aktivitetskrav/useVurderAktivitetskrav";
import { Alert, Button, Heading, List, Textarea } from "@navikt/ds-react";
import { useAktivitetskravNotificationAlert } from "@/sider/aktivitetskrav/useAktivitetskravNotificationAlert";
import { FormProvider, useForm } from "react-hook-form";
import { StansdatoDatePicker } from "@/sider/aktivitetskrav/vurdering/StansdatoDatePicker";
import { useAktivitetskravVurderingDocument } from "@/hooks/aktivitetskrav/useAktivitetskravVurderingDocument";
import { defaultErrorTexts } from "@/api/errors";
import { Paragraph } from "@/components/Paragraph";

const texts = {
  sendInnstilling: "Send",
  avbryt: "Avbryt",
  title: "Skriv innstilling om stans til NAY",
  innstillingInfoLabel: "Når du skriver innstillingen",
  innstillingInfoDescription:
    "Skriv kort om hvilke opplysninger som ligger til grunn for stans av sykepenger, samt din vurdering av hvorfor aktivitetsplikten ikke er oppfylt og vurdering av eventuelle nye opplysninger.",
  form: {
    begrunnelseLabel: "Begrunnelse (obligatorisk)",
    missingBegrunnelse: "Vennligst angi begrunnelse",
  },
  afterSendInfo: {
    title: "Videre må du huske å:",
    gosysoppgave: "Sende oppgave til NAY i Gosys.",
    gosysoppgaveListe: {
      tema: "Tema: Sykepenger",
      gjelder: "Gjelder: Aktivitetskrav",
      oppgavetype: "Oppgavetype: Vurder konsekvens for ytelse",
      prioritet: "Prioritet: Høy",
    },
    stoppknapp:
      "Gi beskjed om stans til ny saksbehandlingsløsning via Stoppknappen under fanen Sykmeldinger i Modia.",
  },
  buttonDescriptionLabel:
    "Send innstilling om stans og stans automatisk utbetaling",
  buttonDescription:
    "Når du sender innstillingen blir den journalført og kan sees i Gosys. Den automatiske utbetalingen til bruker stanses og oppgaven blir deretter plukket opp av saksbehandler fra Gosys.",
};

const begrunnelseMaxLength = 8000;

export interface FormValues {
  stansFom: Date;
  begrunnelse: string;
}

interface Props {
  aktivitetskravUuid: string;
  varselSvarfrist: Date;
}

export default function InnstillingOmStansSkjema({
  aktivitetskravUuid,
  varselSvarfrist,
}: Props) {
  const formMethods = useForm<FormValues>();
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
  } = formMethods;
  const vurderAktivitetskrav = useVurderAktivitetskrav(aktivitetskravUuid);
  const { innstillingOmStansDocument } = useAktivitetskravVurderingDocument();
  const { displayNotification } = useAktivitetskravNotificationAlert();

  function submit(values: FormValues) {
    const createAktivitetskravVurderingDTO: InnstillingOmStansVurderingDTO = {
      status: AktivitetskravStatus.INNSTILLING_OM_STANS,
      stansFom: values.stansFom,
      beskrivelse: values.begrunnelse,
      document: innstillingOmStansDocument({
        stansDato: values.stansFom,
        begrunnelse: values.begrunnelse,
      }),
    };
    vurderAktivitetskrav.mutate(createAktivitetskravVurderingDTO, {
      onSuccess: () => {
        displayNotification(AktivitetskravStatus.INNSTILLING_OM_STANS);
      },
    });
  }

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(submit)} className="gap-4 flex flex-col">
        <Heading level="2" size="small" className="mt-4">
          {texts.title}
        </Heading>

        <StansdatoDatePicker varselSvarfrist={varselSvarfrist} />

        <Paragraph
          label={texts.innstillingInfoLabel}
          body={texts.innstillingInfoDescription}
        />

        <Textarea
          {...register("begrunnelse", {
            maxLength: begrunnelseMaxLength,
            required: texts.form.missingBegrunnelse,
          })}
          value={watch("begrunnelse")}
          label={texts.form.begrunnelseLabel}
          error={errors.begrunnelse?.message}
          size="small"
          minRows={6}
          maxLength={begrunnelseMaxLength}
        />

        <List as="ul" title={texts.afterSendInfo.title} size={"small"}>
          {texts.afterSendInfo.gosysoppgave}
          <List as="ul" className="ml-1">
            <List.Item>{texts.afterSendInfo.gosysoppgaveListe.tema}</List.Item>
            <List.Item>
              {texts.afterSendInfo.gosysoppgaveListe.oppgavetype}
            </List.Item>
            <List.Item>
              {texts.afterSendInfo.gosysoppgaveListe.gjelder}
            </List.Item>
            <List.Item>
              {texts.afterSendInfo.gosysoppgaveListe.prioritet}
            </List.Item>
          </List>
        </List>

        <Paragraph
          label={texts.buttonDescriptionLabel}
          body={texts.buttonDescription}
        />

        {vurderAktivitetskrav.isError && (
          <Alert variant="error" size="small">
            {defaultErrorTexts.generalError}
          </Alert>
        )}
        <Button
          loading={vurderAktivitetskrav.isPending}
          type="submit"
          className="w-fit"
        >
          {texts.sendInnstilling}
        </Button>
      </form>
    </FormProvider>
  );
}
