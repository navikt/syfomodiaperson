import React from "react";
import {
  BodyShort,
  Box,
  Button,
  Heading,
  List,
  Textarea,
} from "@navikt/ds-react";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { Forhandsvisning } from "@/components/Forhandsvisning";
import { useForm } from "react-hook-form";
import {
  VurderingRequestDTO,
  VurderingType,
} from "@/data/arbeidsuforhet/arbeidsuforhetTypes";
import { useArbeidsuforhetVurderingDocument } from "@/hooks/arbeidsuforhet/useArbeidsuforhetVurderingDocument";
import { useSendVurderingArbeidsuforhet } from "@/data/arbeidsuforhet/useSendVurderingArbeidsuforhet";
import { Link, Navigate } from "react-router-dom";
import { arbeidsuforhetPath } from "@/routers/AppRouter";
import { ButtonRow } from "@/components/Layout";
import { useNotification } from "@/context/notification/NotificationContext";

const texts = {
  title: "Skriv innstilling om oppfylt vilkår",
  veiledning: {
    info: "Skriv en kort begrunnelse for hvorfor bruker oppfyller vilkårene i § 8-4, og hvilke opplysninger som ligger til grunn for vurderingen.", // TODO: Avklar fjernet likevel
    hvisFriskmeldingTilArbeidsformidling:
      "Hvis du har vurdert ordningen friskmelding til arbeidsformidling, skriv hvorfor ordningen eventuelt er aktuell og legg inn henvisning til §8-5.",
  },
  begrunnelseLabel: "Begrunnelse (obligatorisk)",
  begrunnelseDescription:
    "Åpne forhåndsvisning for å se vurderingen. Når du trykker Lagre journalføres vurderingen automatisk.",
  forDuGarVidere: {
    head: "Før du går videre bør du gjøre følgende:",
    step1: "Informere bruker om utfallet av vurderingen.", // TODO: Skal det gjøres når det ikke er sendt forhåndsvarsel først?
    step2:
      "Besvare Gosys-oppgaven dersom Nav Arbeid og ytelser ba om vurderingen.",
  },
  forhandsvisningLabel: "Forhåndsvis vurderingen",
  missingBegrunnelse: "Vennligst angi begrunnelse",
  sendVarselButtonText: "Lagre",
  avbrytButton: "Avbryt",
  success:
    "Vurderingen om at bruker oppfyller § 8-4 er lagret i historikken og blir journalført automatisk.",
};

interface Props {
  forhandsvarselSendtDato: Date | undefined;
}

const defaultValues = { begrunnelse: "" };
const begrunnelseMaxLength = 1000;

interface SkjemaValues {
  begrunnelse: string;
}

export const OppfyltForm = ({ forhandsvarselSendtDato }: Props) => {
  const sendVurdering = useSendVurderingArbeidsuforhet();
  const { getOppfyltDocument } = useArbeidsuforhetVurderingDocument();
  const { setNotification } = useNotification();
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm<SkjemaValues>({ defaultValues });
  const submit = (values: SkjemaValues) => {
    const vurderingRequestDTO: VurderingRequestDTO = {
      type: VurderingType.OPPFYLT,
      begrunnelse: values.begrunnelse,
      document: getOppfyltDocument({
        begrunnelse: values.begrunnelse,
        forhandsvarselSendtDato: forhandsvarselSendtDato,
      }),
    };
    sendVurdering.mutate(vurderingRequestDTO, {
      onSuccess: () => {
        setNotification({
          message: texts.success,
        });
      },
    });
  };

  if (sendVurdering.isSuccess) {
    return <Navigate to={arbeidsuforhetPath} />;
  }

  return (
    <Box background="surface-default" padding="6">
      <form onSubmit={handleSubmit(submit)} className="[&>*]:mb-4">
        <Heading level="2" size="medium">
          {texts.title}
        </Heading>
        <BodyShort>{texts.veiledning.info}</BodyShort>
        <BodyShort>
          {texts.veiledning.hvisFriskmeldingTilArbeidsformidling}
        </BodyShort>
        <Textarea
          {...register("begrunnelse", {
            maxLength: begrunnelseMaxLength,
            required: texts.missingBegrunnelse,
          })}
          value={watch("begrunnelse")}
          label={texts.begrunnelseLabel}
          description={texts.begrunnelseDescription}
          error={errors.begrunnelse?.message}
          size="small"
          minRows={6}
          maxLength={begrunnelseMaxLength}
        />
        {sendVurdering.isError && (
          <SkjemaInnsendingFeil error={sendVurdering.error} />
        )}
        <List as="ol" size="small" title={texts.forDuGarVidere.head}>
          <List.Item>{texts.forDuGarVidere.step1}</List.Item>
          <List.Item>{texts.forDuGarVidere.step2}</List.Item>
        </List>
        <ButtonRow>
          <Button loading={sendVurdering.isPending} type="submit">
            {texts.sendVarselButtonText}
          </Button>
          <Forhandsvisning
            contentLabel={texts.forhandsvisningLabel}
            getDocumentComponents={() =>
              getOppfyltDocument({
                begrunnelse: watch("begrunnelse"),
                forhandsvarselSendtDato: forhandsvarselSendtDato,
              })
            }
          />
          <Button as={Link} to={arbeidsuforhetPath} variant="secondary">
            {texts.avbrytButton}
          </Button>
        </ButtonRow>
      </form>
    </Box>
  );
};
