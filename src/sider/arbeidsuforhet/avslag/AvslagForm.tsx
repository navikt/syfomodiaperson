import React from "react";
import { useSaveVurderingArbeidsuforhet } from "@/sider/arbeidsuforhet/hooks/useSaveVurderingArbeidsuforhet";
import { useArbeidsuforhetVurderingDocument } from "@/sider/arbeidsuforhet/hooks/useArbeidsuforhetVurderingDocument";
import { FormProvider, useForm } from "react-hook-form";
import {
  VurderingRequestDTO,
  VurderingResponseDTO,
  VurderingType,
} from "@/sider/arbeidsuforhet/data/arbeidsuforhetTypes";
import {
  BodyLong,
  Box,
  Button,
  Heading,
  List,
  Textarea,
} from "@navikt/ds-react";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { ButtonRow } from "@/components/Layout";
import { Forhandsvisning } from "@/components/Forhandsvisning";
import { Link } from "react-router-dom";
import { arbeidsuforhetPath } from "@/routers/AppRouter";
import { AvslagDatePicker } from "@/sider/arbeidsuforhet/avslag/AvslagDatePicker";
import { useNotification } from "@/context/notification/NotificationContext";
import { Paragraph } from "@/components/Paragraph";
import dayjs from "dayjs";

const texts = {
  title: "Skriv innstilling om avslag til NAY",
  innstillingInfoLabel: "Når du skriver innstillingen",
  begrunnelseLabel: "Begrunnelse (obligatorisk)",
  info1:
    "Skriv kort hvilke opplysninger som ligger til grunn for avslaget, samt din vurdering av hvorfor vilkåret ikke er oppfylt og vurdering av eventuelle nye opplysninger.",
  info2:
    "Hvis du har vurdert ordningen friskmelding til arbeidsformidling: skriv hvorfor ordningen ikke er aktuell og legg inn henvisning til §8-5.",
  afterSendInfo: {
    title: "Videre må du huske å:",
    gosysoppgave:
      "Sende beskjed i Gosys til Nav Arbeid og Ytelser. Dette er for å gjøre saksbehandler oppmerksom på at det har kommet en innstilling og at utbetalingen skal stanses.",
    gosysoppgaveListe: {
      tema: "Tema: Sykepenger",
      gjelder: "Gjelder: Behandle vedtak",
      oppgavetype: "Oppgavetype: Vurder konsekvens for ytelse",
      prioritet: "Prioritet: Høy",
    },
  },
  buttonDescriptionLabel:
    "Send innstilling om avslag og stans automatisk utbetaling",
  buttonDescription:
    "Når du sender innstillingen blir den journalført og kan sees i Gosys. Den automatiske utbetalingen til bruker stanses og oppgaven blir deretter plukket opp av saksbehandler fra Gosys.",
  forhandsvisningLabel: "Forhåndsvis innstillingen",
  missingBegrunnelse: "Vennligst angi begrunnelse",
  sendVarselButtonText: "Send",
  avbrytButton: "Avbryt",
  success:
    "Innstilling om avslag § 8-4 er lagret i historikken og blir journalført automatisk. Automatisk utbetaling av sykepenger er stanset.",
};

const begrunnelseMaxLength = 5000;

export interface Props {
  sisteVurdering: VurderingResponseDTO;
}

export interface ArbeidsuforhetAvslagSkjemaValues {
  begrunnelse: string;
  fom: Date;
}

export function AvslagForm({ sisteVurdering }: Props) {
  const lagreVurdering = useSaveVurderingArbeidsuforhet();
  const { getAvslagDocument } = useArbeidsuforhetVurderingDocument();
  const { setNotification } = useNotification();
  const formMethods = useForm<ArbeidsuforhetAvslagSkjemaValues>();
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
  } = formMethods;

  const submit = (values: ArbeidsuforhetAvslagSkjemaValues) => {
    const vurderingRequestDTO: VurderingRequestDTO = {
      type: VurderingType.AVSLAG,
      begrunnelse: values.begrunnelse,
      document: getAvslagDocument(
        {
          begrunnelse: values.begrunnelse,
          fom: values.fom,
        },
        sisteVurdering.createdAt
      ),
      gjelderFom: dayjs(values.fom).format("YYYY-MM-DD"),
    };
    lagreVurdering.mutate(vurderingRequestDTO, {
      onSuccess: () => {
        setNotification({
          message: texts.success,
        });
      },
    });
  };

  return (
    <Box background="surface-default" padding="6" className="mb-2">
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(submit)} className="[&>*]:mb-4">
          <Heading level="2" size="medium">
            {texts.title}
          </Heading>
          {sisteVurdering.varsel && (
            <AvslagDatePicker
              varselSvarfrist={sisteVurdering.varsel.svarfrist}
            />
          )}
          <Paragraph label={texts.innstillingInfoLabel} body={texts.info1} />
          <BodyLong size={"small"}>{texts.info2}</BodyLong>
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
          {lagreVurdering.isError && (
            <SkjemaInnsendingFeil error={lagreVurdering.error} />
          )}
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
          <ButtonRow>
            <Button loading={lagreVurdering.isPending} type="submit">
              {texts.sendVarselButtonText}
            </Button>
            <Forhandsvisning
              contentLabel={texts.forhandsvisningLabel}
              getDocumentComponents={() =>
                getAvslagDocument(
                  {
                    begrunnelse: watch("begrunnelse"),
                    fom: watch("fom"),
                  },
                  sisteVurdering.createdAt
                )
              }
            />
            <Button as={Link} to={arbeidsuforhetPath} variant="secondary">
              {texts.avbrytButton}
            </Button>
          </ButtonRow>
        </form>
      </FormProvider>
    </Box>
  );
}
