import React from "react";
import {
  Box,
  Button,
  Heading,
  List,
  Textarea,
  HelpText,
  Label,
} from "@navikt/ds-react";
import { useController, useForm } from "react-hook-form";
import { Forhandsvisning } from "@/components/Forhandsvisning";
import { ButtonRow } from "@/components/Layout";
import { useManglendeMedvirkningVurderingDocument } from "@/hooks/manglendemedvirkning/useManglendeMedvirkningVurderingDocument";
import { useSendVurdering } from "@/data/manglendemedvirkning/useSendVurderingManglendeMedvirkning";
import {
  ForhandsvarselVurdering,
  VurderingType,
} from "@/data/manglendemedvirkning/manglendeMedvirkningTypes";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { getForhandsvarselFrist } from "@/utils/forhandsvarselUtils";
import BoundedDatePicker from "@/components/BoundedDatePicker";
import { addWeeks, toDateOnly } from "@/utils/datoUtils";
import dayjs from "dayjs";

const texts = {
  title: "Send forhåndsvarsel",
  beskrivelseLabel: "Begrunnelse (obligatorisk)",
  begrunnelseDescription:
    "Begrunnelsen din blir en del av en større brevmal. Åpne forhåndsvisning for å se hele varselet.",
  svarfristLabel: "Svarfrist",
  svarfristHelptext:
    "Her kan du sette tilpasset/egen frist i forhåndsvarslet. Du kan ikke gi mindre enn 3 uker frist, og ikke mer enn 6 uker.",
  helptexts: [
    "Skriv kort hvilke opplysninger som ligger til grunn for forhåndsvarselet.",
    "Skriv kort din vurdering av hvorfor vilkåret om medvirkning ikke er oppfylt.",
    "Dersom det er relevant, nevn årsaken til at bruker ikke medvirket, og hvorfor dette ikke er rimelig grunn.",
    "Dersom bruker kan forhindre stans, ved å starte å medvirke, beskriv på hvilken måte bruker kan gjøre dette.",
  ],
  forhandsvisning: "Forhåndsvisning",
  forhandsvisningLabel: "Forhåndsvis forhåndsvarselet",
  missingBeskrivelse: "Vennligst angi begrunnelse",
  missingFristDato: "Vennligst velg en gyldig dato",
  sendVarselButtonText: "Send",
};

const begrunnelseMaxLength = 5000;
const forhandsvarselFrist = getForhandsvarselFrist();

interface SkjemaValues {
  begrunnelse: string;
  fristDato: Date;
}

export default function ForhandsvarselSkjema() {
  const personident = useValgtPersonident();
  const sendForhandsvarsel = useSendVurdering<ForhandsvarselVurdering>();
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm<SkjemaValues>({
    defaultValues: { begrunnelse: "", fristDato: forhandsvarselFrist },
    mode: "onChange",
  });

  const threeWeeks = toDateOnly(addWeeks(new Date(), 3));
  const sixWeeks = toDateOnly(addWeeks(new Date(), 6));
  const { field: fristField, fieldState: fristFieldState } = useController<
    SkjemaValues,
    "fristDato"
  >({
    name: "fristDato",
    control,
    rules: {
      required: texts.missingFristDato,
    },
  });

  const { getForhandsvarselDocument } =
    useManglendeMedvirkningVurderingDocument();

  const submit = (values: SkjemaValues) => {
    const fristDate = values.fristDato ?? forhandsvarselFrist;
    const forhandsvarselRequestDTO: ForhandsvarselVurdering = {
      vurderingType: VurderingType.FORHANDSVARSEL,
      personident: personident,
      begrunnelse: values.begrunnelse,
      document: getForhandsvarselDocument({
        begrunnelse: values.begrunnelse,
        frist: fristDate,
      }),
      varselSvarfrist: dayjs(fristDate).format("YYYY-MM-DD"),
    };
    sendForhandsvarsel.mutate(forhandsvarselRequestDTO);
  };

  return (
    <Box background="surface-default" padding="6">
      <form onSubmit={handleSubmit(submit)}>
        <Heading className="mb-4" level="2" size="medium">
          {texts.title}
        </Heading>
        <div className="flex gap-6 items-start mb-4 mt-4">
          <BoundedDatePicker
            fromDate={threeWeeks}
            toDate={sixWeeks}
            defaultSelected={fristField.value}
            onChange={(date) => fristField.onChange(date as Date)}
            label={
              <div className="flex gap-1 items-center">
                <Label size="small">{texts.svarfristLabel}</Label>
                <HelpText placement="right">{texts.svarfristHelptext}</HelpText>
              </div>
            }
            error={fristFieldState.error && fristFieldState.error.message}
          />
        </div>
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
                frist: watch("fristDato") || forhandsvarselFrist,
              })
            }
          />
        </ButtonRow>
      </form>
    </Box>
  );
}
