import React, { ChangeEvent, useState } from "react";
import {
  Brevmal,
  SendForhandsvarselDTO,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import { useAktivitetskravVarselDocument } from "@/hooks/aktivitetskrav/useAktivitetskravVarselDocument";
import { addWeeks } from "@/utils/datoUtils";
import { ButtonRow } from "@/components/Layout";
import { Button, Select } from "@navikt/ds-react";
import { useSendForhandsvarsel } from "@/data/aktivitetskrav/useSendForhandsvarsel";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import {
  AktivitetskravSkjemaValues,
  VurderAktivitetskravSkjemaProps,
} from "@/components/aktivitetskrav/vurdering/vurderAktivitetskravSkjemaTypes";
import { useForm } from "react-hook-form";
import BegrunnelseTextarea, {
  begrunnelseMaxLength,
} from "@/components/aktivitetskrav/vurdering/BegrunnelseTextarea";
import { SkjemaHeading } from "@/components/aktivitetskrav/vurdering/SkjemaHeading";
import { ForhandsvisningModal } from "@/components/ForhandsvisningModal";
import * as Amplitude from "@/utils/amplitude";
import { EventType } from "@/utils/amplitude";

const texts = {
  title: "Send forhåndsvarsel",
  beskrivelseLabel: "Begrunnelse (obligatorisk)",
  forhandsvisning: "Forhåndsvisning",
  forhandsvisningLabel: "Forhåndsvis forhåndsvarselet",
  missingBeskrivelse: "Vennligst angi begrunnelse",
  sendVarselButtonText: "Send",
  avbrytButtonText: "Avbryt",
  malLabel: "Velg mal?",
  malDescription: "Noe om forskjellig tekst i brevet?",
  malMedArbeidsgiver: "Med arbeidsgiver",
  malUtenArbeidsgiver: "Uten arbeidsgiver",
};

const forhandsvarselFrist = addWeeks(new Date(), 3);
const defaultValues = { begrunnelse: "", arsak: undefined };

export const SendForhandsvarselSkjema = ({
  aktivitetskravUuid,
}: VurderAktivitetskravSkjemaProps) => {
  const sendForhandsvarsel = useSendForhandsvarsel(aktivitetskravUuid);
  const [brevmal, setBrevmal] = useState<Brevmal>("MED_ARBEIDSGIVER");
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<AktivitetskravSkjemaValues>({ defaultValues });
  const { getForhandsvarselDocument } = useAktivitetskravVarselDocument();
  const [showForhandsvisning, setShowForhandsvisning] = useState(false);

  const submit = (values: AktivitetskravSkjemaValues) => {
    const forhandsvarselDTO: SendForhandsvarselDTO = {
      fritekst: values.begrunnelse,
      document: getForhandsvarselDocument({
        mal: brevmal,
        begrunnelse: values.begrunnelse,
        frist: forhandsvarselFrist,
      }),
    };
    if (aktivitetskravUuid) {
      sendForhandsvarsel.mutate(forhandsvarselDTO, {
        onSuccess: () => reset(),
      });
    }
  };

  const handlePreviewButtonClick = () => {
    setShowForhandsvisning(true);
    Amplitude.logEvent({
      type: EventType.ButtonClick,
      data: { tekst: texts.forhandsvisning, url: window.location.href },
    });
  };

  const handleBrevmalChanged = (
    e: ChangeEvent<HTMLSelectElement> & { target: { value: Brevmal } }
  ) => {
    setBrevmal(e.target.value);
    Amplitude.logEvent({
      type: EventType.OptionSelected,
      data: {
        url: window.location.href,
        select: "Aktivitetskrav forhåndsvarsel brevmal",
        option: e.target.value,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)}>
      <SkjemaHeading title={texts.title} />
      <Select
        size="small"
        className="w-fit mb-4"
        label={texts.malLabel}
        description={texts.malDescription}
        onChange={handleBrevmalChanged}
      >
        <option value="MED_ARBEIDSGIVER">{texts.malMedArbeidsgiver}</option>
        <option value="UTEN_ARBEIDSGIVER">{texts.malUtenArbeidsgiver}</option>
      </Select>
      <BegrunnelseTextarea
        className="mb-8"
        {...register("begrunnelse", {
          maxLength: begrunnelseMaxLength,
          required: true,
        })}
        value={watch("begrunnelse")}
        label={texts.beskrivelseLabel}
        error={errors.begrunnelse && texts.missingBeskrivelse}
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
            frist: forhandsvarselFrist,
          })
        }
      />
    </form>
  );
};
