import React from "react";
import {
  BodyLong,
  BodyShort,
  Box,
  Button,
  DatePicker,
  Heading,
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
import { useSendVurderingArbeidsuforhet } from "@/sider/arbeidsuforhet/hooks/useSendVurderingArbeidsuforhet";
import { useArbeidsuforhetVurderingDocument } from "@/hooks/arbeidsuforhet/useArbeidsuforhetVurderingDocument";
import { useNotification } from "@/context/notification/NotificationContext";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { useNavigate } from "react-router";

const texts = {
  title: "Innstilling uten forhåndsvarsel",
  description: "Vurderingen du skriver skal brukes i vedtaket…",
  arsakTilInnstilling: {
    radioLegend: "Hvorfor sendes innstilling uten forhåndsvarsel?",
    sykepengerIkkeUtbetalt: "Sykepenger ikke utbetalt",
    nyVurderingFraNay: "NAY ber om ny vurdering",
    required: "Vennligst angi årsak til innstilling",
  },
  oppgaveSendtFraNayDato: {
    label: "Når sendte NAY oppgaven i GOSYS?",
    required: "Vennligst angi dato oppgaven ble sendt fra NAY",
  },
  begrunnelseLabel: "Begrunnelse (obligatorisk)",
  missingBegrunnelse: "Vennligst angi begrunnelse",
  huskGosysMelding: "Husk at du fortsatt må skrive en melding til Nay i GOSYS.",
  lagreInnstilling: "Lagre innstilling",
  forhandsvisning: "Forhåndsvisning",
  avbryt: "Avbryt",
  innstillingenErLagret:
    "Innstillingen er lagret og blir journalført automatisk.",
};

const begrunnelseMaxLength = 1000;

interface SkjemaValues {
  arsak:
    | VurderingArsak.SYKEPENGER_IKKE_UTBETALT
    | VurderingArsak.NAY_BER_OM_NY_VURDERING;
  oppgaveFraNayDato?: Date;
  begrunnelse: string;
}

export default function InnstillingUtenForhandsvarsel() {
  const navigate = useNavigate();
  const lagreInnstilling = useSendVurderingArbeidsuforhet();
  const { getInnstillingUtenForhandsvarselDocument } =
    useArbeidsuforhetVurderingDocument();
  const { setNotification } = useNotification();
  const {
    register,
    watch,
    control,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm<SkjemaValues>();
  const { field, fieldState } = useController({
    name: "oppgaveFraNayDato",
    control,
    rules: {
      required: watch("arsak") === VurderingArsak.NAY_BER_OM_NY_VURDERING,
    },
  });
  const submit = (values: SkjemaValues) => {
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
        <BodyLong>{texts.description}</BodyLong>
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
        {lagreInnstilling.isError && (
          <SkjemaInnsendingFeil error={lagreInnstilling.error} />
        )}
        <BodyShort>{texts.description}</BodyShort>
        <ButtonRow>
          <Button type="submit" loading={lagreInnstilling.isPending}>
            {texts.lagreInnstilling}
          </Button>
          <Forhandsvisning
            contentLabel={texts.forhandsvisning}
            getDocumentComponents={() =>
              getInnstillingUtenForhandsvarselDocument({
                arsak: watch("arsak"),
                begrunnelse: watch("begrunnelse"),
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
