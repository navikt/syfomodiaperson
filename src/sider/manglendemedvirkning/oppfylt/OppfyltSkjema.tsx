import { BodyShort, Box, Button, Heading, Textarea } from "@navikt/ds-react";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { ButtonRow } from "@/components/Layout";
import { Forhandsvisning } from "@/components/Forhandsvisning";
import { Link } from "react-router-dom";
import { manglendeMedvirkningPath } from "@/routers/AppRouter";
import React from "react";
import { useSendVurderingManglendeMedvirkning } from "@/data/manglendemedvirkning/useSendVurderingManglendeMedvirkning";
import { useForm } from "react-hook-form";
import {
  NewVurderingRequestDTO,
  VurderingType,
} from "@/data/manglendemedvirkning/manglendeMedvirkningTypes";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { useNotification } from "@/context/notification/NotificationContext";
import { useManglendeMedvirkningVurderingDocument } from "@/hooks/manglendemedvirkning/useManglendeMedvirkningVurderingDocument";

const texts = {
  title: "Skriv innstilling om oppfylt vilkår",
  info: "Skriv en kort begrunnelse for hvorfor bruker likevel oppfyller vilkårene i § 8-8, og hvilke opplysninger som ligger til grunn for vurderingen.",
  bruker:
    "Før du går videre bør du informere bruker om utfallet av vurderingen.",
  begrunnelse: {
    label: "Begrunnelse (obligatorisk)",
    description:
      "Åpne forhåndsvisning for å se vurderingen. Når du trykker Lagre journalføres vurderingen automatisk.",
    missing: "Vennligst angi begrunnelse",
  },
  buttons: {
    previewContentLabel: "Forhåndsvis vurderingen",
    save: "Lagre",
    cancel: "Avbryt",
  },
  success:
    "Vurderingen om at bruker oppfyller § 8-8 er lagret i historikken og blir journalført automatisk.",
};

const begrunnelseMaxLength = 1000;

interface SkjemaValues {
  begrunnelse: string;
}

interface Props {
  forhandsvarselSendtDato: Date;
}

export default function OppfyltSkjema({ forhandsvarselSendtDato }: Props) {
  const { setNotification } = useNotification();
  const { getOppfyltDocument } = useManglendeMedvirkningVurderingDocument();
  const personident = useValgtPersonident();
  const sendVurdering = useSendVurderingManglendeMedvirkning();
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm<SkjemaValues>();

  const submit = (values: SkjemaValues) => {
    const oppfyltDocumentProps = {
      begrunnelse: values.begrunnelse,
      forhandsvarselSendtDato: forhandsvarselSendtDato,
    };
    const vurderingRequestDTO: NewVurderingRequestDTO = {
      personident,
      vurderingType: VurderingType.OPPFYLT,
      begrunnelse: values.begrunnelse,
      document: getOppfyltDocument(oppfyltDocumentProps),
    };
    sendVurdering.mutate(vurderingRequestDTO, {
      onSuccess: () => {
        setNotification({
          message: texts.success,
        });
      },
    });
  };

  return (
    <Box background="surface-default" padding="6" className="mb-2">
      <form onSubmit={handleSubmit(submit)} className="[&>*]:mb-4">
        <Heading level="2" size="medium">
          {texts.title}
        </Heading>
        <BodyShort>{texts.info}</BodyShort>
        <Textarea
          {...register("begrunnelse", {
            maxLength: begrunnelseMaxLength,
            required: texts.begrunnelse.missing,
          })}
          value={watch("begrunnelse")}
          label={texts.begrunnelse.label}
          description={texts.begrunnelse.description}
          error={errors.begrunnelse?.message}
          size="small"
          minRows={6}
          maxLength={begrunnelseMaxLength}
        />
        {sendVurdering.isError && (
          <SkjemaInnsendingFeil error={sendVurdering.error} />
        )}
        <BodyShort>{texts.bruker}</BodyShort>
        <ButtonRow>
          <Button loading={sendVurdering.isPending} type="submit">
            {texts.buttons.save}
          </Button>
          <Forhandsvisning
            contentLabel={texts.buttons.previewContentLabel}
            getDocumentComponents={() =>
              getOppfyltDocument({
                begrunnelse: watch("begrunnelse"),
                forhandsvarselSendtDato: forhandsvarselSendtDato,
              })
            }
          />
          <Button as={Link} to={manglendeMedvirkningPath} variant="secondary">
            {texts.buttons.cancel}
          </Button>
        </ButtonRow>
      </form>
    </Box>
  );
}
