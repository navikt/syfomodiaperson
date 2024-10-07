import React from "react";
import { Box, Button, Heading, List, Textarea } from "@navikt/ds-react";
import { useForm } from "react-hook-form";
import { Forhandsvisning } from "@/components/Forhandsvisning";
import { ButtonRow } from "@/components/Layout";
import { addDays, addWeeks } from "@/utils/datoUtils";
import { useManglendeMedvirkningVurderingDocument } from "@/hooks/manglendemedvirkning/useManglendeMedvirkningVurderingDocument";
import { useSendVurdering } from "@/data/manglendemedvirkning/useSendVurderingManglendeMedvirkning";
import {
  ForhandsvarselVurdering,
  VurderingType,
} from "@/data/manglendemedvirkning/manglendeMedvirkningTypes";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { erProd } from "@/utils/miljoUtil";

const texts = {
  title: "Send forhåndsvarsel",
  beskrivelseLabel: "Begrunnelse (obligatorisk)",
  begrunnelseDescription:
    "Begrunnelsen din blir en del av en større brevmal. Åpne forhåndsvisning for å se hele varselet.",
  helptexts: [
    "Skriv kort hvilke opplysninger som ligger til grunn for forhåndsvarselet.",
    "Skriv kort din vurdering av hvorfor vilkåret om medvirkning ikke er oppfylt.",
    "Dersom det er relevant, nevn årsaken til at bruker ikke medvirket, og hvorfor dette ikke er rimelig grunn.",
    "Dersom bruker kan forhindre stans, ved å starte å medvirke, beskriv på hvilken måte bruker kan gjøre dette.",
  ],
  forhandsvisning: "Forhåndsvisning",
  forhandsvisningLabel: "Forhåndsvis forhåndsvarselet",
  missingBeskrivelse: "Vennligst angi begrunnelse",
  sendVarselButtonText: "Send",
};

const begrunnelseMaxLength = 5000;
const forhandsvarselFrist = erProd()
  ? addWeeks(new Date(), 3)
  : addDays(new Date(), 1);

interface SkjemaValues {
  begrunnelse: string;
}

export default function ForhandsvarselSkjema() {
  const personident = useValgtPersonident();
  const sendForhandsvarsel = useSendVurdering<ForhandsvarselVurdering>();
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm<SkjemaValues>({ defaultValues: { begrunnelse: "" } });

  const { getForhandsvarselDocument } =
    useManglendeMedvirkningVurderingDocument();

  const submit = (values: SkjemaValues) => {
    const forhandsvarselRequestDTO: ForhandsvarselVurdering = {
      vurderingType: VurderingType.FORHANDSVARSEL,
      personident: personident,
      begrunnelse: values.begrunnelse,
      document: getForhandsvarselDocument({
        begrunnelse: values.begrunnelse,
        frist: forhandsvarselFrist,
      }),
      varselSvarfrist: forhandsvarselFrist,
    };
    sendForhandsvarsel.mutate(forhandsvarselRequestDTO);
  };

  return (
    <Box background="surface-default" padding="6">
      <form onSubmit={handleSubmit(submit)}>
        <Heading className="mb-4" level="2" size="medium">
          {texts.title}
        </Heading>
        <List as="ul" size="small">
          {texts.helptexts.map((text, index) => (
            <List.Item key={index} className="mb-2">
              {text}
            </List.Item>
          ))}
        </List>
        <Textarea
          className="mb-8 mt-8"
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
        {sendForhandsvarsel.isError && (
          <SkjemaInnsendingFeil error={sendForhandsvarsel.error} />
        )}
        <ButtonRow>
          <Button loading={sendForhandsvarsel.isPending} type="submit">
            {texts.sendVarselButtonText}
          </Button>
          <Forhandsvisning
            contentLabel={texts.forhandsvisningLabel}
            getDocumentComponents={() =>
              getForhandsvarselDocument({
                begrunnelse: watch("begrunnelse"),
                frist: forhandsvarselFrist,
              })
            }
          />
        </ButtonRow>
      </form>
    </Box>
  );
}
