import React, { ChangeEvent, useState } from "react";
import { SendForhandsvarselDTO } from "@/data/aktivitetskrav/aktivitetskravTypes";
import { useAktivitetskravVurderingDocument } from "@/hooks/aktivitetskrav/useAktivitetskravVurderingDocument";
import { getForhandsvarselFrist } from "@/utils/forhandsvarselUtils";
import { addWeeks, toDateOnly } from "@/utils/datoUtils";
import { ButtonRow } from "@/components/Layout";
import { Button, HelpText, Label, Select, Textarea } from "@navikt/ds-react";
import { useSendForhandsvarsel } from "@/data/aktivitetskrav/useSendForhandsvarsel";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { VurderAktivitetskravSkjemaProps } from "@/sider/aktivitetskrav/vurdering/vurderAktivitetskravSkjemaTypes";
import { useForm, useController } from "react-hook-form";
import { SkjemaHeading } from "@/sider/aktivitetskrav/vurdering/SkjemaHeading";
import { ForhandsvisningModal } from "@/components/ForhandsvisningModal";
import { Brevmal } from "@/data/aktivitetskrav/forhandsvarselTexts";
import BoundedDatePicker from "@/components/BoundedDatePicker";
import dayjs from "dayjs";

const texts = {
  title: "Send forhåndsvarsel",
  beskrivelseLabel: "Begrunnelse (obligatorisk)",
  begrunnelseDescription:
    "Begrunnelsen din blir en del av en større brevmal. Åpne forhåndsvisning for å se hele varselet. Varselet journalføres automatisk etter utsending.",
  forhandsvisning: "Forhåndsvisning",
  forhandsvisningLabel: "Forhåndsvis forhåndsvarselet",
  missingBeskrivelse: "Vennligst angi begrunnelse",
  missingFristDato: "Vennligst velg en gyldig dato",
  sendVarselButtonText: "Send",
  avbrytButtonText: "Avbryt",
  malLabel: "Velg arbeidssituasjon",
  malHelptext:
    "Her kan du velge mellom ulike brevmaler som er tilpasset den sykmeldtes arbeidssituasjon",
  svarfristLabel: "Svarfrist",
  svarfristHelptext:
    "Her kan du sette tilpasset/egen frist i forhåndsvarslet. Du kan ikke gi mindre enn 3 uker frist, og ikke mer enn 6 uker.",
};

const brevMalTexts: {
  [key in Brevmal]: string;
} = {
  [Brevmal.MED_ARBEIDSGIVER]: "Har arbeidsgiver",
  [Brevmal.UTEN_ARBEIDSGIVER]: "Har ikke arbeidsgiver",
  [Brevmal.UTLAND]: "Bosatt i utlandet",
};

interface SendForhandsvarselSkjemaValues {
  begrunnelse: string;
  fristDato: Date;
}

const defaultValues: SendForhandsvarselSkjemaValues = {
  begrunnelse: "",
  fristDato: getForhandsvarselFrist(),
};

const begrunnelseMaxLength = 5000;

export const SendForhandsvarselSkjema = ({
  aktivitetskravUuid,
}: VurderAktivitetskravSkjemaProps) => {
  const sendForhandsvarsel = useSendForhandsvarsel(aktivitetskravUuid);
  const [brevmal, setBrevmal] = useState<Brevmal>(Brevmal.MED_ARBEIDSGIVER);
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
    reset,
    control,
  } = useForm<SendForhandsvarselSkjemaValues>({
    defaultValues,
    mode: "onChange",
  });
  const threeWeeks = toDateOnly(addWeeks(new Date(), 3));
  const sixWeeks = toDateOnly(addWeeks(new Date(), 6));
  const { field: fristField, fieldState: fristFieldState } = useController<
    SendForhandsvarselSkjemaValues,
    "fristDato"
  >({
    name: "fristDato",
    control,
    rules: {
      required: texts.missingFristDato,
    },
  });
  const { getForhandsvarselDocument } = useAktivitetskravVurderingDocument();
  const [showForhandsvisning, setShowForhandsvisning] = useState(false);

  const submit = (values: SendForhandsvarselSkjemaValues) => {
    const fristDate = values.fristDato;
    const forhandsvarselDTO: SendForhandsvarselDTO = {
      fritekst: values.begrunnelse,
      document: getForhandsvarselDocument({
        mal: brevmal,
        begrunnelse: values.begrunnelse,
        frist: fristDate,
      }),
      frist: dayjs(fristDate).format("YYYY-MM-DD"),
    };
    if (aktivitetskravUuid) {
      sendForhandsvarsel.mutate(forhandsvarselDTO, {
        onSuccess: () => reset(),
      });
    }
  };

  const handlePreviewButtonClick = () => {
    handleSubmit(() => {
      setShowForhandsvisning(true);
    })();
  };

  const handleBrevmalChanged = (
    e: ChangeEvent<HTMLSelectElement> & { target: { value: Brevmal } }
  ) => {
    setBrevmal(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit(submit)}>
      <SkjemaHeading title={texts.title} />
      <div className="flex gap-6 items-start mb-4">
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
        <Select
          size="small"
          className="w-fit"
          label={
            <div className="flex gap-1 items-center">
              <Label size="small">{texts.malLabel}</Label>
              <HelpText placement="right">{texts.malHelptext}</HelpText>
            </div>
          }
          onChange={handleBrevmalChanged}
        >
          {Object.keys(brevMalTexts).map((key, index) => (
            <option key={index} value={key as Brevmal}>
              {brevMalTexts[key]}
            </option>
          ))}
        </Select>
      </div>
      <Textarea
        className="mb-8"
        {...register("begrunnelse", {
          maxLength: begrunnelseMaxLength,
          required: true,
        })}
        value={watch("begrunnelse")}
        label={texts.beskrivelseLabel}
        description={texts.begrunnelseDescription}
        error={errors.begrunnelse && texts.missingBeskrivelse}
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
        <Button
          variant="secondary"
          type="button"
          onClick={handlePreviewButtonClick}
        >
          {texts.forhandsvisning}
        </Button>
      </ButtonRow>
      <ForhandsvisningModal
        contentLabel={texts.forhandsvisningLabel}
        isOpen={showForhandsvisning}
        handleClose={() => setShowForhandsvisning(false)}
        getDocumentComponents={() =>
          getForhandsvarselDocument({
            mal: brevmal,
            begrunnelse: watch("begrunnelse"),
            frist: watch("fristDato") || getForhandsvarselFrist(),
          })
        }
      />
    </form>
  );
};
