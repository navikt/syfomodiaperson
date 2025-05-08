import { Forhandsvisning } from "@/components/Forhandsvisning";
import { manglendeMedvirkningPath } from "@/routers/AppRouter";
import { Box, Button, Heading, HStack, List, Textarea } from "@navikt/ds-react";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useManglendeMedvirkningVurderingDocument } from "@/hooks/manglendemedvirkning/useManglendeMedvirkningVurderingDocument";
import {
  StansVurdering,
  VurderingType,
} from "@/data/manglendemedvirkning/manglendeMedvirkningTypes";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { useNotification } from "@/context/notification/NotificationContext";
import { useSendVurdering } from "@/data/manglendemedvirkning/useSendVurderingManglendeMedvirkning";
import { StansdatoDatePicker } from "@/sider/manglendemedvirkning/stans/StansdatoDatePicker";
import { Paragraph } from "@/components/Paragraph";

const texts = {
  heading: "Skriv innstilling om stans til NAY",
  innstillingInfoLabel: "Når du skriver innstillingen",
  innstillingInfoParagraph:
    "Skriv kort hvilke opplysninger som ligger til grunn for stans, samt din vurdering av hvorfor vilkåret ikke er oppfylt og vurdering av eventuelle nye opplysninger.",
  begrunnelseLabel: "Begrunnelse (obligatorisk)",
  afterSendInfo: {
    title: "Videre må du huske å:",
    gosysoppgave:
      "Sende beskjed i Gosys til Nav Arbeid og Ytelser. Dette er for å gjøre saksbehandler oppmerksom på at det har kommet en innstilling og at utbetalingen skal stanses.",
    gosysoppgaveListe: {
      tema: "Tema: Sykepenger",
      gjelder: "Gjelder: Aktivitetskrav",
      oppgavetype: "Oppgavetype: Vurder konsekvens for ytelse",
      prioritet: "Prioritet: Høy",
    },
  },
  buttonDescriptionLabel:
    "Send innstilling om stans og stans automatisk utbetaling",
  buttonDescription:
    "Når du sender innstillingen blir den journalført og kan sees i Gosys. Den automatiske utbetalingen til bruker stanses og oppgaven blir deretter plukket opp av saksbehandler fra Gosys.",
  forhandsvisningLabel: "Forhåndsvis innstillingen",
  missingBegrunnelse: "Vennligst angi begrunnelse",
  sendVarselButtonText: "Send",
  avbrytButton: "Avbryt",
  success:
    "Innstilling om stans § 8-8 medvirkningsplikten er lagret i historikken og blir journalført automatisk. Automatisk utbetaling av sykepenger er stanset.",
};

const begrunnelseMaxLength = 5000;

export interface StansSkjemaValues {
  begrunnelse: string;
  stansdato: Date;
}

interface Props {
  varselSvarfrist: Date;
}

export default function StansSkjema({ varselSvarfrist }: Props) {
  const personident = useValgtPersonident();
  const sendVurdering = useSendVurdering<StansVurdering>();
  const formMethods = useForm<StansSkjemaValues>();
  const {
    register,
    watch,
    getValues,
    formState: { errors },
    handleSubmit,
  } = formMethods;

  const { getStansDocument } = useManglendeMedvirkningVurderingDocument();
  const { setNotification } = useNotification();

  function submit(values: StansSkjemaValues) {
    const stansVurdering: StansVurdering = {
      personident: personident,
      vurderingType: VurderingType.STANS,
      begrunnelse: values.begrunnelse,
      stansdato: values.stansdato,
      document: getStansDocument({
        begrunnelse: values.begrunnelse,
        stansdato: values.stansdato,
      }),
    };

    sendVurdering.mutate(stansVurdering, {
      onSuccess: () => {
        setNotification({
          message: texts.success,
          variant: "success",
        });
      },
    });
  }

  return (
    <Box background="surface-default" padding="6">
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(submit)} className="[&>*]:mb-4">
          <Heading level="2" size="medium">
            {texts.heading}
          </Heading>
          <StansdatoDatePicker varselSvarfrist={varselSvarfrist} />
          <Paragraph
            label={texts.innstillingInfoLabel}
            body={texts.innstillingInfoParagraph}
          />
          <Textarea
            {...register("begrunnelse", {
              maxLength: begrunnelseMaxLength,
              required: texts.missingBegrunnelse,
            })}
            value={watch("begrunnelse")}
            label={texts.begrunnelseLabel}
            error={errors.begrunnelse?.message}
            size="small"
            minRows={6}
            maxLength={begrunnelseMaxLength}
          />
          <List as="ul" title={texts.afterSendInfo.title} size={"small"}>
            {texts.afterSendInfo.gosysoppgave}
            <List as="ul" className="ml-1">
              <List.Item>
                {texts.afterSendInfo.gosysoppgaveListe.tema}
              </List.Item>
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
          <HStack gap="4">
            <Button loading={sendVurdering.isPending} type="submit">
              {texts.sendVarselButtonText}
            </Button>
            <Forhandsvisning
              contentLabel={texts.forhandsvisningLabel}
              getDocumentComponents={() =>
                getStansDocument({
                  begrunnelse: getValues("begrunnelse"),
                  stansdato: getValues("stansdato"),
                })
              }
            />
            <Button as={Link} to={manglendeMedvirkningPath} variant="secondary">
              {texts.avbrytButton}
            </Button>
          </HStack>
        </form>
      </FormProvider>
    </Box>
  );
}
