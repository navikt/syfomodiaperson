import {
  BodyShort,
  Box,
  Button,
  Heading,
  HStack,
  Textarea,
} from "@navikt/ds-react";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { Link } from "react-router-dom";
import { manglendeMedvirkningPath } from "@/routers/AppRouter";
import React from "react";
import { useSendVurdering } from "@/data/manglendemedvirkning/useSendVurderingManglendeMedvirkning";
import { useForm } from "react-hook-form";
import {
  IkkeAktuellVurdering,
  VurderingType,
} from "@/data/manglendemedvirkning/manglendeMedvirkningTypes";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { useNotification } from "@/context/notification/NotificationContext";
import { useManglendeMedvirkningVurderingDocument } from "@/hooks/manglendemedvirkning/useManglendeMedvirkningVurderingDocument";
import { Forhandsvisning } from "@/components/Forhandsvisning";

const texts = {
  title: "Vurdering av medvirkningsplikten er ikke lenger aktuell",
  info: "Skriv en kort begrunnelse for hvorfor det ikke lenger er aktuelt å vurdere vilkårene i § 8-8 første og tredje ledd.",
  begrunnelse: {
    label: "Begrunnelse (obligatorisk)",
    description:
      "Når du trykker Lagre journalføres vurderingen automatisk og hendelsen fjernes fra oversikten.",
    missing: "Vennligst angi begrunnelse",
  },
  buttons: {
    save: "Lagre",
    previewContentLabel: "Forhåndsvis vurderingen",
    cancel: "Avbryt",
  },
  success:
    "Vurderingen er lagret i historikken og blir journalført automatisk.",
};

const begrunnelseMaxLength = 1000;

interface SkjemaValues {
  begrunnelse: string;
}

export default function IkkeAktuellSkjema() {
  const { setNotification } = useNotification();
  const { getIkkeAktuellDocument } = useManglendeMedvirkningVurderingDocument();
  const personident = useValgtPersonident();
  const sendVurdering = useSendVurdering<IkkeAktuellVurdering>();
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
    getValues,
  } = useForm<SkjemaValues>();

  const submit = (values: SkjemaValues) => {
    const vurderingRequestDTO: IkkeAktuellVurdering = {
      personident,
      vurderingType: VurderingType.IKKE_AKTUELL,
      begrunnelse: values.begrunnelse,
      document: getIkkeAktuellDocument({ begrunnelse: values.begrunnelse }),
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
        <HStack gap="4">
          <Button loading={sendVurdering.isPending} type="submit">
            {texts.buttons.save}
          </Button>
          <Forhandsvisning
            contentLabel={texts.buttons.previewContentLabel}
            getDocumentComponents={() =>
              getIkkeAktuellDocument({
                begrunnelse: getValues("begrunnelse"),
              })
            }
          />
          <Button as={Link} to={manglendeMedvirkningPath} variant="secondary">
            {texts.buttons.cancel}
          </Button>
        </HStack>
      </form>
    </Box>
  );
}
