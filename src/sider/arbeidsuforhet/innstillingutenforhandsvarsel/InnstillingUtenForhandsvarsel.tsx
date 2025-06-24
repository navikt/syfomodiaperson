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
import { arbeidsuforhetPath } from "@/routers/AppRouter";
import { FormProvider, useForm } from "react-hook-form";
import {
  VurderingInitiertAv,
  VurderingType,
  AvslagUtenForhandsvarsel,
} from "@/sider/arbeidsuforhet/data/arbeidsuforhetTypes";
import { useSaveVurderingArbeidsuforhet } from "@/sider/arbeidsuforhet/hooks/useSaveVurderingArbeidsuforhet";
import { useArbeidsuforhetVurderingDocument } from "@/sider/arbeidsuforhet/hooks/useArbeidsuforhetVurderingDocument";
import { useNotification } from "@/context/notification/NotificationContext";
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
  huskGosysMelding: "Send oppgave til Nav Arbeid og ytelser i Gosys:",
  huskGosysMeldingPunkter: [
    "Tema: Sykepenger",
    "Gjelder: Behandle vedtak",
    "Oppgavetype: Vurder konsekvens for ytelse",
    "Prioritet: Høy",
  ],
  journalforInnstilling: "Journalfør innstilling",
  forhandsvisning: "Forhåndsvisning",
  avbryt: "Avbryt",
  innstillingenErLagret:
    "Innstillingen om avslag er lagret og blir journalført automatisk.",
};

const begrunnelseMaxLength = 5000;

interface FormValues {
  vurderingInitiertAv: VurderingInitiertAv;
  oppgaveFraNayDato?: Date;
  avslagFom: Date;
  begrunnelse: string;
}

export default function InnstillingUtenForhandsvarsel() {
  const navigate = useNavigate();
  const lagreInnstilling = useSaveVurderingArbeidsuforhet();
  const { getInnstillingUtenForhandsvarselDocument } =
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
      document: getInnstillingUtenForhandsvarselDocument(documentProps),
    };
    lagreInnstilling.mutate(vurderingRequestDTO, {
      onSuccess: () => {
        setNotification({
          message: texts.innstillingenErLagret,
        });
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
          <div>
            <Heading level="4" size="xsmall">
              {texts.huskGosysMelding}
            </Heading>
            <List as="ul" size="small">
              {texts.huskGosysMeldingPunkter.map((text, index) => (
                <List.Item key={index} className="mb-2">
                  {text}
                </List.Item>
              ))}
            </List>
          </div>
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
                getInnstillingUtenForhandsvarselDocument({
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
