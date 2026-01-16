import React from "react";
import {
  BodyLong,
  BodyShort,
  Box,
  Button,
  Heading,
  List,
  Radio,
  RadioGroup,
  Textarea,
} from "@navikt/ds-react";
import { ButtonRow } from "@/components/Layout";
import { Forhandsvisning } from "@/components/Forhandsvisning";
import { Link } from "react-router-dom";
import { arbeidsuforhetPath } from "@/AppRouter";
import { FormProvider, useForm } from "react-hook-form";
import {
  VurderingInitiertAv,
  VurderingType,
  AvslagUtenForhandsvarsel,
} from "@/sider/arbeidsuforhet/data/arbeidsuforhetTypes";
import { useSaveVurderingArbeidsuforhet } from "@/sider/arbeidsuforhet/hooks/useSaveVurderingArbeidsuforhet";
import { useArbeidsuforhetVurderingDocument } from "@/sider/arbeidsuforhet/hooks/useArbeidsuforhetVurderingDocument";
import {
  Notification,
  useNotification,
} from "@/context/notification/NotificationContext";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { useNavigate } from "react-router";
import OppgaveSendtFraNayDatepicker from "@/sider/arbeidsuforhet/innstillingutenforhandsvarsel/OppgaveSendtFraNayDatepicker";
import AvslagFomDatepicker from "@/sider/arbeidsuforhet/innstillingutenforhandsvarsel/AvslagFomDatepicker";
import dayjs from "dayjs";

const texts = {
  title: "Innstilling om avslag uten forhåndsvarsel",
  info: "Her skal du gjøre vurderinger i saker der utbetaling ikke er igangsatt.",
  innstillingenJournalfores:
    "Innstillingen journalføres og blir synlig i Gosys.",
  vurderingInitiertAv: {
    radioLegend: "Hvem har initiert vurderingen? (obligatorisk)",
    navVeileder: "Nav-kontor",
    nayBerOmVurdering: "NAY",
    required: "Vennligst angi årsak til innstilling",
  },
  begrunnelseLabel: "Begrunnelse (obligatorisk)",
  begrunnelseDescription:
    "Skriv kort hvilke opplysninger som ligger til grunn for avslaget, samt din vurdering av hvorfor vilkåret ikke er oppfylt og vurdering av eventuelle nye opplysninger.",
  missingBegrunnelse: "Vennligst angi begrunnelse",
  videreHusk: {
    title: "Videre må du huske å:",
    gosysoppgave:
      "Sende beskjed i Gosys til Nav Arbeid og Ytelser. Dette er for å gjøre saksbehandler oppmerksom på at det har kommet en innstilling og at utbetalingen ikke skal igangsettes.",
    gosysoppgaveListe: {
      tema: "Tema: Sykepenger",
      gjelder: "Gjelder: Behandle vedtak",
      oppgavetype: "Oppgavetype: Vurder konsekvens for ytelse",
      prioritet: "Prioritet: Høy",
    },
  },
  huskGosysMeldingHeading: "Husk å svare på oppgave i Gosys",
  huskGosysMeldingContent:
    "For å fullføre prosessen må du svare på oppgaven fra Nav arbeid og ytelser i Gosys.",
  journalforInnstilling: "Journalfør innstilling",
  forhandsvisning: "Forhåndsvisning",
  avbryt: "Avbryt",
  innstillingenErLagret:
    "Innstillingen om avslag er lagret og blir journalført automatisk.",
};

const begrunnelseMaxLength = 5000;

const huskSendTilGosysNotification: Notification = {
  message: (
    <>
      <Heading spacing size="xsmall" level="3">
        {texts.huskGosysMeldingHeading}
      </Heading>
      {texts.huskGosysMeldingContent}
    </>
  ),
  alertVariant: "info",
};

interface FormValues {
  vurderingInitiertAv: VurderingInitiertAv;
  oppgaveFraNayDato?: Date;
  avslagFom: Date;
  begrunnelse: string;
}

export default function InnstillingUtenForhandsvarsel() {
  const navigate = useNavigate();
  const lagreInnstilling = useSaveVurderingArbeidsuforhet();
  const { getAvslagUtenForhandsvarselDocument } =
    useArbeidsuforhetVurderingDocument();
  const { setNotification } = useNotification();
  const formProps = useForm<FormValues>();
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
  } = formProps;

  const submit = (values: FormValues) => {
    const documentProps = {
      vurderingInitiertAv: values.vurderingInitiertAv,
      begrunnelse: values.begrunnelse,
      avslagFom: values.avslagFom,
      oppgaveFraNayDato:
        values.vurderingInitiertAv === VurderingInitiertAv.NAY
          ? values.oppgaveFraNayDato
          : undefined,
    };
    const vurderingRequestDTO: AvslagUtenForhandsvarsel = {
      type: VurderingType.AVSLAG_UTEN_FORHANDSVARSEL,
      vurderingInitiertAv: values.vurderingInitiertAv,
      begrunnelse: values.begrunnelse,
      gjelderFom: dayjs(values.avslagFom).format("YYYY-MM-DD"),
      oppgaveFraNayDato:
        values.vurderingInitiertAv === VurderingInitiertAv.NAY
          ? dayjs(values.oppgaveFraNayDato).format("YYYY-MM-DD")
          : undefined,
      document: getAvslagUtenForhandsvarselDocument(documentProps),
    };
    lagreInnstilling.mutate(vurderingRequestDTO, {
      onSuccess: () => {
        const notification: Notification =
          values.vurderingInitiertAv === VurderingInitiertAv.NAY
            ? huskSendTilGosysNotification
            : { message: texts.innstillingenErLagret, alertVariant: "success" };
        setNotification(notification);
        navigate(arbeidsuforhetPath);
      },
    });
  };

  return (
    <Box background="surface-default" padding="6" className="mb-2">
      <FormProvider {...formProps}>
        <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
          <Heading level="2" size="medium">
            {texts.title}
          </Heading>
          <BodyShort>{texts.info}</BodyShort>
          <AvslagFomDatepicker />
          <RadioGroup
            name="vurderingInitiertAv"
            legend={texts.vurderingInitiertAv.radioLegend}
            size="small"
            error={
              errors.vurderingInitiertAv && texts.vurderingInitiertAv.required
            }
          >
            <Radio
              value={VurderingInitiertAv.NAV_KONTOR}
              {...register("vurderingInitiertAv", { required: true })}
            >
              {texts.vurderingInitiertAv.navVeileder}
            </Radio>
            <Radio
              value={VurderingInitiertAv.NAY}
              {...register("vurderingInitiertAv", { required: true })}
            >
              {texts.vurderingInitiertAv.nayBerOmVurdering}
            </Radio>
          </RadioGroup>
          {watch("vurderingInitiertAv") === VurderingInitiertAv.NAY && (
            <OppgaveSendtFraNayDatepicker />
          )}
          <Textarea
            {...register("begrunnelse", {
              maxLength: begrunnelseMaxLength,
              required: texts.missingBegrunnelse,
            })}
            description={texts.begrunnelseDescription}
            value={watch("begrunnelse")}
            label={texts.begrunnelseLabel}
            error={errors.begrunnelse?.message}
            size="small"
            minRows={3}
            maxLength={begrunnelseMaxLength}
          />
          <List as="ul" title={texts.videreHusk.title} size={"small"}>
            {texts.videreHusk.gosysoppgave}
            <List as="ul" className="ml-1">
              <List.Item>{texts.videreHusk.gosysoppgaveListe.tema}</List.Item>
              <List.Item>
                {texts.videreHusk.gosysoppgaveListe.oppgavetype}
              </List.Item>
              <List.Item>
                {texts.videreHusk.gosysoppgaveListe.gjelder}
              </List.Item>
              <List.Item>
                {texts.videreHusk.gosysoppgaveListe.prioritet}
              </List.Item>
            </List>
          </List>
          <BodyLong>{texts.innstillingenJournalfores}</BodyLong>
          {lagreInnstilling.isError && (
            <SkjemaInnsendingFeil error={lagreInnstilling.error} />
          )}
          <ButtonRow>
            <Button type="submit" loading={lagreInnstilling.isPending}>
              {texts.journalforInnstilling}
            </Button>
            <Forhandsvisning
              contentLabel={texts.forhandsvisning}
              getDocumentComponents={() =>
                getAvslagUtenForhandsvarselDocument({
                  vurderingInitiertAv: watch("vurderingInitiertAv"),
                  begrunnelse: watch("begrunnelse"),
                  avslagFom: watch("avslagFom"),
                  oppgaveFraNayDato: watch("oppgaveFraNayDato"),
                })
              }
            />
            <Button as={Link} to={arbeidsuforhetPath} variant="secondary">
              {texts.avbryt}
            </Button>
          </ButtonRow>
        </form>
      </FormProvider>
    </Box>
  );
}
