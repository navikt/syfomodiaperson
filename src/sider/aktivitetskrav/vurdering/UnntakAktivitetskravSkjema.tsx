import React, { useEffect, useRef, useState } from "react";
import {
  AktivitetskravStatus,
  CreateAktivitetskravVurderingDTO,
  UnntakVurderingArsak,
  VarselType,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import { unntakVurderingArsakTexts } from "@/data/aktivitetskrav/aktivitetskravTexts";
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
  useDraftQuery,
  useSaveDraft,
} from "@/hooks/useDraftQuery";
import { DraftSaveStatus } from "@/components/DraftSaveStatus";

const texts = {
  title: "Sett unntak fra aktivitetskravet",
  arsakLegend: "Årsak (obligatorisk)",
  begrunnelseLabel: "Begrunnelse (obligatorisk)",
  begrunnelseDescription:
    "Når du trykker Lagre journalføres vurderingen automatisk.",
  missingArsak: "Vennligst angi årsak",
  missingBegrunnelse: "Vennligst angi begrunnelse",
  lagre: "Lagre",
};

const defaultValues = { begrunnelse: "", arsak: undefined };
const begrunnelseMaxLength = 1000;

export interface UnntakAktivitetskravSkjemaValues
  extends AktivitetskravSkjemaValues {
  arsak: UnntakVurderingArsak;
}

const CATEGORY = "aktivitetskrav-unntak";

export function UnntakAktivitetskravSkjema({
  aktivitetskravUuid,
}: VurderAktivitetskravSkjemaProps) {
  const [utkastSavedTime, setUtkastSavedTime] = useState<Date>();
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
  } = useForm<UnntakAktivitetskravSkjemaValues>({ defaultValues });
  const vurderAktivitetskrav = useVurderAktivitetskrav(aktivitetskravUuid);
  const { getVurderingDocument } = useAktivitetskravVurderingDocument();
  const { displayNotification } = useAktivitetskravNotificationAlert();

  const getDraftQuery = useDraftQuery<DraftTextDTO>(CATEGORY);
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

  const draftApplied = useRef(false);

  useEffect(() => {
    if (!draftApplied.current && getDraftQuery.data?.begrunnelse) {
      setValue("begrunnelse", getDraftQuery.data.begrunnelse);
      draftApplied.current = true;
    }
  }, [getDraftQuery.data, setValue]);

  const submit = (values: UnntakAktivitetskravSkjemaValues) => {
    const status = AktivitetskravStatus.UNNTAK;
    const { begrunnelse, arsak } = values;
    const createAktivitetskravVurderingDTO: CreateAktivitetskravVurderingDTO = {
      status,
      arsaker: [arsak],
      beskrivelse: begrunnelse,
      document: getVurderingDocument({
        begrunnelse,
        arsak,
        varselType: VarselType.UNNTAK,
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
          {Object.entries(unntakVurderingArsakTexts).map(
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
            required: true,
            onChange: (e) => debouncedAutoSaveDraft(e.target.value),
          })}
          error={errors.begrunnelse && texts.missingBegrunnelse}
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
