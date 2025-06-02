import React from "react";
import {
  BodyLong,
  BodyShort,
  Box,
  Button,
  Heading,
  Radio,
  RadioGroup,
  Textarea,
} from "@navikt/ds-react";
import { ButtonRow } from "@/components/Layout";
import { Forhandsvisning } from "@/components/Forhandsvisning";
import { Link } from "react-router-dom";
import { arbeidsuforhetPath } from "@/routers/AppRouter";
import { useForm } from "react-hook-form";
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
    nyVurderingFraNay: "Det trengs en ny vurdering fra NAY", // TODO: "NAY ber om ny vurdering"?
    required: "Vennligst angi årsak til innstilling",
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
  arsak: VurderingArsak.SYKEPENGER_IKKE_UTBETALT | VurderingArsak.FRISKMELDT;
  begrunnelse: string;
}

export default function InnstillingUtenForhandsvarsel() {
  //TODO: Lagre / Sende ?
  const navigate = useNavigate();
  const lagreInnstilling = useSendVurderingArbeidsuforhet();
  const { getInnstillingUtenForhandsvarselDocument } =
    useArbeidsuforhetVurderingDocument();
  const { setNotification } = useNotification();
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm<SkjemaValues>();
  const submit = (values: SkjemaValues) => {
    const documentProps = {
      arsak: values.arsak,
      begrunnelse: values.begrunnelse,
    };
    const vurderingRequestDTO: VurderingRequestDTO = {
      type: VurderingType.AVSLAG_UTEN_FORHANDSVARSEL, //TODO: Hva gjør vi med denne?
      arsak: values.arsak,
      begrunnelse: values.begrunnelse,
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
            value={VurderingArsak.FRISKMELDT}
            {...register("arsak", { required: true })}
          >
            {texts.arsakTilInnstilling.nyVurderingFraNay}
          </Radio>
        </RadioGroup>
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
            getDocumentComponents={
              () => [] // TODO: Disable forhandsvisning?
              // getInnstillingUtenForhandsvarselDocument({
              //   arsak: values.arsak,
              //   begrunnelse: values.begrunnelse,
              // })
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
