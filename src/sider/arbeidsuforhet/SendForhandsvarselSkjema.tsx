import React from "react";
import {
  Box,
  Button,
  Heading,
  HelpText,
  Label,
  List,
  Textarea,
} from "@navikt/ds-react";
import { useController, useForm } from "react-hook-form";
import { useArbeidsuforhetVurderingDocument } from "@/sider/arbeidsuforhet/hooks/useArbeidsuforhetVurderingDocument";
import { Forhandsvisning } from "@/components/Forhandsvisning";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import {
  Forhandsvarsel,
  VurderingType,
} from "@/sider/arbeidsuforhet/data/arbeidsuforhetTypes";
import { useSaveVurderingArbeidsuforhet } from "@/sider/arbeidsuforhet/hooks/useSaveVurderingArbeidsuforhet";
import { getForhandsvarselFrist } from "@/utils/forhandsvarselUtils";
import { useNavigate } from "react-router";
import { arbeidsuforhetPath } from "@/routers/AppRouter";
import { useNotification } from "@/context/notification/NotificationContext";
import { Link } from "react-router-dom";
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
    "Skriv en kort setning om det er vilkåret om sykdom eller skade, arbeidsuførhet, eller årsakssammenheng mellom de to, som ikke er oppfylt. Skriv kort hvilke opplysninger som ligger til grunn for forhåndsvarsel.",
    "Skriv kort din vurdering av hvorfor vilkåret ikke er oppfylt.",
    "Hvis du har vurdert ordningen friskmelding til arbeidsformidling: skriv hvorfor ordningen ikke er aktuell og legg inn henvisning til §8-5.",
  ],
  defaultTextareaValue: "Nav vurderer å avslå sykepengene dine fordi ...",
  forhandsvisning: "Forhåndsvisning",
  forhandsvisningLabel: "Forhåndsvis forhåndsvarselet",
  missingBeskrivelse: "Vennligst angi begrunnelse",
  missingFristDato: "Vennligst velg en gyldig dato",
  sendVarselButtonText: "Send",
  forhandsvarselSendt:
    "Forhåndsvarsel er sendt. Personen ligger nå i oversikten og kan finnes under filteret for § 8-4 arbeidsuførhet.",
  avbrytButton: "Avbryt",
};

const forhandsvarselFrist = getForhandsvarselFrist();
const defaultValues = {
  begrunnelse: texts.defaultTextareaValue,
  fristDato: forhandsvarselFrist,
};
const begrunnelseMaxLength = 8000;

interface SkjemaValues {
  begrunnelse: string;
  fristDato: Date;
}

export default function SendForhandsvarselSkjema() {
  const navigate = useNavigate();
  const { setNotification } = useNotification();
  const sendForhandsvarsel = useSaveVurderingArbeidsuforhet();
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm<SkjemaValues>({ defaultValues, mode: "onChange" });
  const { getForhandsvarselDocument } = useArbeidsuforhetVurderingDocument();

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

  const submit = (values: SkjemaValues) => {
    const fristDate = values.fristDato ?? forhandsvarselFrist;
    const forhandsvarselRequestDTO: Forhandsvarsel = {
      type: VurderingType.FORHANDSVARSEL,
      begrunnelse: values.begrunnelse,
      document: getForhandsvarselDocument({
        begrunnelse: values.begrunnelse,
        frist: fristDate,
      }),
      frist: dayjs(fristDate).format("YYYY-MM-DD"),
    };
    sendForhandsvarsel.mutate(forhandsvarselRequestDTO, {
      onSuccess: () => {
        setNotification({
          message: texts.forhandsvarselSendt,
        });
        navigate(arbeidsuforhetPath);
      },
    });
  };

  return (
    <Box background="surface-default" padding="6" className="mb-2">
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
            validate: (value) =>
              value !== texts.defaultTextareaValue || texts.missingBeskrivelse,
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
        <div className="flex gap-4">
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
          <Button as={Link} to={arbeidsuforhetPath} variant="secondary">
            {texts.avbrytButton}
          </Button>
        </div>
      </form>
    </Box>
  );
}
