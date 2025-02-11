import {
  AktivitetskravStatus,
  InnstillingOmStansVurderingDTO,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import React from "react";
import { useVurderAktivitetskrav } from "@/data/aktivitetskrav/useVurderAktivitetskrav";
import {
  Alert,
  BodyShort,
  Button,
  Heading,
  List,
  Textarea,
} from "@navikt/ds-react";
import { useAktivitetskravNotificationAlert } from "@/sider/aktivitetskrav/useAktivitetskravNotificationAlert";
import { FormProvider, useForm } from "react-hook-form";
import { StansdatoDatePicker } from "@/sider/aktivitetskrav/vurdering/StansdatoDatePicker";
import { useAktivitetskravVurderingDocument } from "@/hooks/aktivitetskrav/useAktivitetskravVurderingDocument";
import { defaultErrorTexts } from "@/api/errors";

const texts = {
  sendInnstilling: "Send innstilling",
  avbryt: "Avbryt",
  title: "Innstilling om stans",
  form: {
    begrunnelseLabel: "Begrunnelse (obligatorisk)",
    begrunnelseDescription:
      "Skriv kort om hvilke opplysninger som ligger til grunn for stans av sykepenger, samt din vurdering av hvorfor aktivitetsplikten ikke er oppfylt og vurdering av eventuelle nye opplysninger.",
    missingBegrunnelse: "Vennligst angi begrunnelse",
  },
  afterSendInfo: {
    title: "Etter innstilling er sendt må du:",
    gosysoppgave: "Sende oppgave til NAY i Gosys.",
    stoppknapp:
      "Gi beskjed om stans til ny saksbehandlingsløsning via Stoppknappen under fanen Sykmeldinger i Modia.",
    innstillingenBlirJournalfort:
      "Innstillingen blir journalført og kan sees i Gosys.",
  },
};

const begrunnelseMaxLength = 5000;

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

        <Textarea
          {...register("begrunnelse", {
            maxLength: begrunnelseMaxLength,
            required: texts.form.missingBegrunnelse,
          })}
          value={watch("begrunnelse")}
          label={texts.form.begrunnelseLabel}
          description={texts.form.begrunnelseDescription}
          error={errors.begrunnelse?.message}
          size="small"
          minRows={6}
          maxLength={begrunnelseMaxLength}
        />

        <List as="ul" size="small" title={texts.afterSendInfo.title}>
          <List.Item>{texts.afterSendInfo.gosysoppgave}</List.Item>
          <List.Item>{texts.afterSendInfo.stoppknapp}</List.Item>
        </List>

        <BodyShort>
          {texts.afterSendInfo.innstillingenBlirJournalfort}
        </BodyShort>

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
