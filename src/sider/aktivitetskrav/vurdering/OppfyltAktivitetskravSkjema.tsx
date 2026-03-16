import React, { useState } from "react";
import {
  AktivitetskravStatus,
  CreateAktivitetskravVurderingDTO,
  OppfyltVurderingArsak,
  VarselType,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import { oppfyltVurderingArsakTexts } from "@/data/aktivitetskrav/aktivitetskravTexts";
import { SkjemaHeading } from "@/sider/aktivitetskrav/vurdering/SkjemaHeading";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { useVurderAktivitetskrav } from "@/data/aktivitetskrav/useVurderAktivitetskrav";
import {
  AktivitetskravSkjemaValues,
  VurderAktivitetskravSkjemaProps,
} from "@/sider/aktivitetskrav/vurdering/vurderAktivitetskravSkjemaTypes";
import { SkjemaFieldContainer } from "@/sider/aktivitetskrav/vurdering/SkjemaFieldContainer";
import { useForm } from "react-hook-form";
import { Button, Radio, RadioGroup, Textarea } from "@navikt/ds-react";
import { useAktivitetskravNotificationAlert } from "@/sider/aktivitetskrav/useAktivitetskravNotificationAlert";
import { useAktivitetskravVurderingDocument } from "@/hooks/aktivitetskrav/useAktivitetskravVurderingDocument";
import { useDebouncedCallback } from "use-debounce";
import {
  DraftTextDTO,
  useDeleteDraft,
  useSaveDraft,
} from "@/hooks/useDraftQuery";
import { DraftSaveStatus } from "@/components/DraftSaveStatus";

const texts = {
  title: "Er i aktivitet",
  arsakLegend: "Årsak (obligatorisk)",
  begrunnelseLabel: "Begrunnelse",
  begrunnelseDescription:
    "Når du trykker Lagre journalføres vurderingen automatisk.",
  missingArsak: "Vennligst angi årsak",
  lagre: "Lagre",
};

export interface OppfyltAktivitetskravSkjemaValues
  extends AktivitetskravSkjemaValues {
  arsak: OppfyltVurderingArsak;
}

const begrunnelseMaxLength = 1000;

const CATEGORY = "aktivitetskrav-oppfylt";

export function OppfyltAktivitetskravSkjema({
  aktivitetskravUuid,
  begrunnelseUtkast,
}: VurderAktivitetskravSkjemaProps) {
  const [utkastSavedTime, setUtkastSavedTime] = useState<Date>();
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<OppfyltAktivitetskravSkjemaValues>({
    defaultValues: { begrunnelse: begrunnelseUtkast ?? "", arsak: undefined },
  });
  const vurderAktivitetskrav = useVurderAktivitetskrav(aktivitetskravUuid);
  const { getVurderingDocument } = useAktivitetskravVurderingDocument();
  const { displayNotification } = useAktivitetskravNotificationAlert();

  const saveDraft = useSaveDraft<DraftTextDTO>(CATEGORY);
  const deleteDraft = useDeleteDraft(CATEGORY);

  const debouncedAutoSaveDraft = useDebouncedCallback((tekst: string) => {
    if (!tekst) return;
    saveDraft.mutate(
      { begrunnelse: tekst },
      {
        onSuccess: () => setUtkastSavedTime(new Date()),
        onError: () => setUtkastSavedTime(undefined),
      }
    );
  }, 750);

  const submit = (values: OppfyltAktivitetskravSkjemaValues) => {
    const { arsak, begrunnelse } = values;
    const status = AktivitetskravStatus.OPPFYLT;
    const createAktivitetskravVurderingDTO: CreateAktivitetskravVurderingDTO = {
      status,
      arsaker: [arsak],
      beskrivelse: begrunnelse,
      document: getVurderingDocument({
        varselType: VarselType.OPPFYLT,
        arsak,
        begrunnelse,
      }),
    };
    vurderAktivitetskrav.mutate(createAktivitetskravVurderingDTO, {
      onSuccess: () => {
        setUtkastSavedTime(undefined);
        debouncedAutoSaveDraft.cancel();
        deleteDraft.mutate(undefined);
        reset();
        displayNotification(status);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)}>
      <SkjemaHeading title={texts.title} />
      <SkjemaFieldContainer>
        <RadioGroup
          name="arsak"
          size="small"
          legend={texts.arsakLegend}
          error={errors.arsak && texts.missingArsak}
        >
          {Object.entries(oppfyltVurderingArsakTexts).map(
            ([arsak, text], index) => (
              <Radio
                key={index}
                value={arsak}
                {...register("arsak", { required: true })}
              >
                {text}
              </Radio>
            )
          )}
        </RadioGroup>
        <Textarea
          {...register("begrunnelse", {
            maxLength: begrunnelseMaxLength,
            onChange: (e) => debouncedAutoSaveDraft(e.target.value),
          })}
          value={watch("begrunnelse")}
          label={texts.begrunnelseLabel}
          description={texts.begrunnelseDescription}
          size="small"
          minRows={6}
          maxLength={begrunnelseMaxLength}
        />
      </SkjemaFieldContainer>
      {vurderAktivitetskrav.isError && (
        <SkjemaInnsendingFeil error={vurderAktivitetskrav.error} />
      )}
      <DraftSaveStatus
        isSaveError={saveDraft.isError}
        savedTime={utkastSavedTime}
      />
      <Button loading={vurderAktivitetskrav.isPending} type="submit">
        {texts.lagre}
      </Button>
    </form>
  );
}
