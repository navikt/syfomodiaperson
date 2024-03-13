import React from "react";
import { Button, Heading, Textarea } from "@navikt/ds-react";
import { ButtonRow } from "@/components/Layout";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { Forhandsvisning } from "@/components/Forhandsvisning";
import { useForm } from "react-hook-form";
import {
  VurderingRequestDTO,
  VurderingType,
} from "@/data/arbeidsuforhet/arbeidsuforhetTypes";
import { useArbeidsuforhetVurderingDocument } from "@/hooks/arbeidsuforhet/useArbeidsuforhetVurderingDocument";
import { useSendVurderingArbeidsuforhet } from "@/data/arbeidsuforhet/useSendVurderingArbeidsuforhet";

const texts = {
  title: (type: VurderingType) => {
    return type === VurderingType.OPPFYLT
      ? "Skriv en kort begrunnelse for hvorfor bruker oppfyller 8-4"
      : "Skriv en kort begrunnelse for hvorfor bruker ikke oppfyller 8-4";
  },
  info: "Det du skriver her blir liggende i historikken på brukeren og et brev med begrunnelse blir sendt til bruker for deg.",
  beskrivelseLabel: "Begrunnelse (obligatorisk)",
  begrunnelseDescription: "Åpne forhåndsvisning for å se hele varselet.",
  forhandsvisning: "Forhåndsvisning",
  forhandsvisningLabel: "Forhåndsvis brev",
  missingBeskrivelse: "Vennligst angi begrunnelse",
  sendVarselButtonText: "Send",
};

const defaultValues = { begrunnelse: "" };
const begrunnelseMaxLength = 1000;

interface SkjemaValues {
  begrunnelse: string;
}

interface VurderingSkjemaProps {
  type: VurderingType;
}

export const VurderingSkjema = ({ type }: VurderingSkjemaProps) => {
  const sendVurdering = useSendVurderingArbeidsuforhet();
  const { getVurderingDocument } = useArbeidsuforhetVurderingDocument();
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm<SkjemaValues>({ defaultValues });

  const submit = (values: SkjemaValues) => {
    const vurderingRequestDTO: VurderingRequestDTO = {
      type,
      begrunnelse: values.begrunnelse,
      document: getVurderingDocument({
        begrunnelse: values.begrunnelse,
        type,
      }),
    };
    sendVurdering.mutate(vurderingRequestDTO);
  };

  return (
    <form onSubmit={handleSubmit(submit)}>
      <Heading className="mt-4 mb-4" level="2" size="small">
        {texts.title(type)}
      </Heading>
      <p>{texts.info}</p>
      <Textarea
        className="mb-8"
        {...register("begrunnelse", {
          maxLength: begrunnelseMaxLength,
          required: texts.missingBeskrivelse,
        })}
        value={watch("begrunnelse")}
        label={texts.beskrivelseLabel}
        description={texts.begrunnelseDescription}
        error={errors.begrunnelse?.message}
        size="small"
        minRows={6}
        maxLength={begrunnelseMaxLength}
      />
      {sendVurdering.isError && (
        <SkjemaInnsendingFeil error={sendVurdering.error} />
      )}
      <ButtonRow>
        <Button loading={sendVurdering.isPending} type="submit">
          {texts.sendVarselButtonText}
        </Button>
        <Forhandsvisning
          contentLabel={texts.forhandsvisningLabel}
          getDocumentComponents={() =>
            getVurderingDocument({
              begrunnelse: watch("begrunnelse"),
              type,
            })
          }
          title={texts.forhandsvisningLabel}
        />
      </ButtonRow>
    </form>
  );
};
