import { Forhandsvisning } from "@/components/Forhandsvisning";
import { useSendVurderingManglendeMedvirkning } from "@/data/manglendemedvirkning/useSendVurderingManglendeMedvirkning";
import { manglendeMedvirkningPath } from "@/routers/AppRouter";
import {
  BodyShort,
  Box,
  Button,
  Heading,
  HStack,
  Link,
  List,
  Textarea,
} from "@navikt/ds-react";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useManglendeMedvirkningVurderingDocument } from "@/hooks/manglendemedvirkning/useManglendeMedvirkningVurderingDocument";
import {
  NewVurderingRequestDTO,
  VurderingType,
} from "@/data/manglendemedvirkning/manglendeMedvirkningTypes";
import { useValgtPersonident } from "@/hooks/useValgtBruker";

const texts = {
  heading: "Skriv innstilling til NAY",
  p1: "Skriv kort hvilke opplysninger som ligger til grunn for stans, samt din vurdering av hvorfor vilkåret ikke er oppfylt og vurdering av eventuelle nye opplysninger.",
  begrunnelseLabel: "Innstilling om stans (obligatorisk)",
  afterSendInfo: {
    title: "Videre må du huske å:",
    gosysoppgave: "Sende oppgave til NAY i Gosys.",
    stoppknapp:
      "Gi beskjed om stans til ny saksbehandlingsløsning via Stoppknappen under fanen Sykmeldinger i Modia.",
  },
  buttonDescription:
    "Når du trykker “Stans” blir innstillingen journalført og kan sees i Gosys.",
  forhandsvisningLabel: "Forhåndsvis innstillingen",
  missingBegrunnelse: "Vennligst angi begrunnelse",
  sendVarselButtonText: "Stans",
  avbrytButton: "Avbryt",
};

const begrunnelseMaxLength = 5000;

export interface StansSkjemaValues {
  begrunnelse: string;
}

export default function StansSkjema() {
  const personident = useValgtPersonident();
  const sendVurdering = useSendVurderingManglendeMedvirkning();
  const formMethods = useForm<StansSkjemaValues>();
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
  } = formMethods;

  const { getStansDocument } = useManglendeMedvirkningVurderingDocument();

  const submit = (values: StansSkjemaValues) => {
    const stansVurdering: NewVurderingRequestDTO = {
      personident: personident,
      vurderingType: VurderingType.STANS,
      begrunnelse: values.begrunnelse,
      document: getStansDocument(values),
    };
    sendVurdering.mutate(stansVurdering);
  };

  return (
    <Box background="surface-default" padding="6">
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(submit)} className="[&>*]:mb-4">
          <Heading level="2" size="medium">
            {texts.heading}
          </Heading>
          <BodyShort>{texts.p1}</BodyShort>
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
          <List as="ul" title={texts.afterSendInfo.title}>
            <List.Item className="ml-8">
              {texts.afterSendInfo.gosysoppgave}
            </List.Item>
            <List.Item className="ml-8">
              {texts.afterSendInfo.stoppknapp}
            </List.Item>
          </List>
          <BodyShort>{texts.buttonDescription}</BodyShort>
          <HStack gap="4">
            <Button loading={sendVurdering.isPending} type="submit">
              {texts.sendVarselButtonText}
            </Button>
            <Button as={Link} to={manglendeMedvirkningPath} variant="secondary">
              {texts.avbrytButton}
            </Button>
            <Forhandsvisning
              contentLabel={texts.forhandsvisningLabel}
              getDocumentComponents={() =>
                getStansDocument({
                  begrunnelse: watch("begrunnelse"),
                })
              }
            />
          </HStack>
        </form>
      </FormProvider>
    </Box>
  );
}
