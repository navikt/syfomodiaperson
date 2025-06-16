import React from "react";
import {
  BodyLong,
  Box,
  Button,
  DatePicker,
  Heading,
  List,
  Radio,
  RadioGroup,
  Textarea,
  useDatepicker,
} from "@navikt/ds-react";
import { ButtonRow } from "@/components/Layout";
import { Forhandsvisning } from "@/components/Forhandsvisning";
import { Link } from "react-router-dom";
import { arbeidsuforhetPath } from "@/routers/AppRouter";
import { useController, useForm } from "react-hook-form";
import {
  VurderingArsak,
  VurderingRequestDTO,
  VurderingType,
} from "@/sider/arbeidsuforhet/data/arbeidsuforhetTypes";
import { useSaveVurderingArbeidsuforhet } from "@/sider/arbeidsuforhet/hooks/useSaveVurderingArbeidsuforhet";
import { useArbeidsuforhetVurderingDocument } from "@/sider/arbeidsuforhet/hooks/useArbeidsuforhetVurderingDocument";
import { useNotification } from "@/context/notification/NotificationContext";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { useNavigate } from "react-router";

const texts = {
  title: "Innstilling om avslag uten forhåndsvarsel",
  description:
    "Innstillingen du skriver journalføres og kan bli brukt i et eventuelt vedtak fra NAY.",
  punkt: [
    "Skriv en kort setning om det er vilkåret om sykdom eller skade, arbeidsuførhet, eller årsakssammenheng mellom de to, som ikke er oppfylt. Skriv kort hvilke opplysninger som ligger til grunn.",
    "Skriv kort din vurdering av hvorfor vilkåret ikke er oppfylt.",
  ],
  arsakTilInnstilling: {
    radioLegend: "Årsak til innstilling uten forhåndsvarsel",
    sykepengerIkkeUtbetalt: "Sykepenger ikke utbetalt",
    nyVurderingFraNay: "NAY ber om vurdering i en sammensatt sak",
    required: "Vennligst angi årsak til innstilling",
  },
  oppgaveSendtFraNayDato: {
    label: "Når sendte NAY oppgaven i GOSYS?",
    required: "Vennligst angi dato oppgaven ble sendt fra NAY",
  },
  begrunnelseLabel: "Begrunnelse (obligatorisk)",
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
  arsak:
    | VurderingArsak.SYKEPENGER_IKKE_UTBETALT
    | VurderingArsak.NAY_BER_OM_NY_VURDERING;
  oppgaveFraNayDato?: Date;
  begrunnelse: string;
}

export default function InnstillingUtenForhandsvarsel() {
  const navigate = useNavigate();
  const lagreInnstilling = useSaveVurderingArbeidsuforhet();
  const { getInnstillingUtenForhandsvarselDocument } =
    useArbeidsuforhetVurderingDocument();
  const { setNotification } = useNotification();
  const {
    register,
    watch,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<FormValues>();
  const { field, fieldState } = useController({
    name: "oppgaveFraNayDato",
    control,
    rules: {
      required: watch("arsak") === VurderingArsak.NAY_BER_OM_NY_VURDERING,
    },
  });
  const submit = (values: FormValues) => {
    const documentProps = {
      arsak: values.arsak,
      begrunnelse: values.begrunnelse,
    };
    const vurderingRequestDTO: VurderingRequestDTO = {
      type: VurderingType.AVSLAG_UTEN_FORHANDSVARSEL,
      arsak: values.arsak,
      begrunnelse: values.begrunnelse,
      document: getInnstillingUtenForhandsvarselDocument(documentProps),
      oppgaveFraNayDato:
        values.arsak === VurderingArsak.NAY_BER_OM_NY_VURDERING
          ? values.oppgaveFraNayDato
          : undefined,
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

  const { datepickerProps, inputProps } = useDatepicker({
    onDateChange: (date: Date | undefined) => field.onChange(date),
    defaultSelected: watch("oppgaveFraNayDato"),
  });

  return (
    <Box background="surface-default" padding="6" className="mb-2">
      <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
        <Heading level="2" size="medium">
          {texts.title}
        </Heading>
        <div>
          <BodyLong>{texts.description}</BodyLong>
          <List as="ul" size="small">
            {texts.punkt.map((text, index) => (
              <List.Item key={index} className="mb-2">
                {text}
              </List.Item>
            ))}
          </List>
        </div>
        <RadioGroup
          name="arsak"
          legend={texts.arsakTilInnstilling.radioLegend}
          size="small"
          error={errors.arsak && texts.arsakTilInnstilling.required}
        >
          <Radio
            value={VurderingArsak.SYKEPENGER_IKKE_UTBETALT}
            {...register("arsak", { required: true })}
          >
            {texts.arsakTilInnstilling.sykepengerIkkeUtbetalt}
          </Radio>
          <Radio
            value={VurderingArsak.NAY_BER_OM_NY_VURDERING}
            {...register("arsak", { required: true })}
          >
            {texts.arsakTilInnstilling.nyVurderingFraNay}
          </Radio>
        </RadioGroup>
        {watch("arsak") === VurderingArsak.NAY_BER_OM_NY_VURDERING && (
          <DatePicker {...datepickerProps} showWeekNumber>
            <DatePicker.Input
              {...inputProps}
              label={texts.oppgaveSendtFraNayDato.label}
              size="small"
              error={fieldState.error && texts.oppgaveSendtFraNayDato.required}
            />
          </DatePicker>
        )}
        <Textarea
          {...register("begrunnelse", {
            maxLength: begrunnelseMaxLength,
            required: texts.missingBegrunnelse,
          })}
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
                arsak: watch("arsak"),
                begrunnelse: watch("begrunnelse"),
                oppgaveFraNayDato: watch("oppgaveFraNayDato"),
              })
            }
          />
          <Button as={Link} to={arbeidsuforhetPath} variant="secondary">
            {texts.avbryt}
          </Button>
        </ButtonRow>
      </form>
    </Box>
  );
}
