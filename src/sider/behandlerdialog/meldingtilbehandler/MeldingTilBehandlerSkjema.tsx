import React, { useEffect, useRef, useState } from "react";
import { Alert, Button, Select, Textarea } from "@navikt/ds-react";
import { BehandlerDTO } from "@/data/behandler/BehandlerDTO";
import {
  MeldingTilBehandlerDTO,
  MeldingType,
} from "@/data/behandlerdialog/behandlerdialogTypes";
import { useMeldingTilBehandler } from "@/data/behandlerdialog/useMeldingTilBehandler";
import {
  tilDatoMedManedNavnOgKlokkeslett,
  showTimeIncludingSeconds,
} from "@/utils/datoUtils";
import { useMeldingTilBehandlerDocument } from "@/hooks/behandlerdialog/document/useMeldingTilBehandlerDocument";
import { behandlerNavn } from "@/utils/behandlerUtils";
import { MeldingsTypeInfo } from "@/sider/behandlerdialog/meldingtilbehandler/MeldingsTypeInfo";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { meldingTypeTexts } from "@/data/behandlerdialog/behandlerdialogTexts";
import { ButtonRow } from "@/components/Layout";
import { ForhandsvisningModal } from "@/components/ForhandsvisningModal";
import { VelgBehandler } from "@/components/behandler/VelgBehandler";
import { PreviewButton } from "@/sider/behandlerdialog/meldingtilbehandler/PreviewButton";
import {
  useDeleteMeldingTilBehandlerDraft,
  useMeldingTilBehandlerDraftQuery,
  useSaveMeldingTilBehandlerDraft,
} from "@/data/behandlerdialog/meldingtilbehandlerDraftQueryHooks";
import { SaveFile } from "@/img/ImageComponents";

const texts = {
  sendKnapp: "Send til behandler",
  previewContentLabel: "Forhåndsvis melding til behandler",
  meldingsType: {
    label: "Hvilken meldingstype ønsker du å sende?",
    defaultOption: "Velg meldingstype",
    missing: "Vennligst velg type melding",
  },
  meldingsTekstLabel: "Skriv inn teksten du ønsker å sende til behandler",
  meldingsTekstMissing: "Vennligst angi meldingstekst",
  velgBehandlerLegend: "Velg behandler som skal motta meldingen",
  utkastSaved: "Utkast lagret",
};

export interface MeldingTilBehandlerSkjemaValues {
  behandlerRef: string;
  meldingsType: MeldingType;
  meldingTekst: string;

  /**
   * Internal field used by `VelgBehandler` radio-group.
   */
  behandlerRefSelection?: string;
}

export const MAX_LENGTH_BEHANDLER_MELDING = 5000;

export const MeldingTilBehandlerSkjema = () => {
  const [displayPreview, setDisplayPreview] = useState(false);
  const [showUtkastSaved, setShowUtkastSaved] = useState(false);
  const [lastUtkastSavedTime, setLastUtkastSavedTime] = useState<Date>();
  const { getMeldingTilBehandlerDocument } = useMeldingTilBehandlerDocument();
  const [selectedBehandler, setSelectedBehandler] = useState<BehandlerDTO>();
  const meldingTilBehandler = useMeldingTilBehandler();
  const formMethods = useForm<MeldingTilBehandlerSkjemaValues>();
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue,
    control,
  } = formMethods;

  const watchedMeldingTekst = useWatch({ control, name: "meldingTekst" }) ?? "";
  const watchedMeldingsType = useWatch({ control, name: "meldingsType" });

  const draftQuery = useMeldingTilBehandlerDraftQuery();
  const saveDraft = useSaveMeldingTilBehandlerDraft();
  const deleteDraft = useDeleteMeldingTilBehandlerDraft();

  const isApplyingDraftRef = useRef(false);
  const autosaveTimeoutRef = useRef<number | undefined>(undefined);

  const now = new Date();
  const meldingTekstErrorMessage =
    errors.meldingTekst &&
    getValues("meldingTekst") === "" &&
    texts.meldingsTekstMissing;

  useEffect(() => {
    const draft = draftQuery.data;
    if (!draft || !draft.tekst) {
      return;
    }

    const draftBehandler = draft.behandler;
    const draftBehandlerRef = draftBehandler?.behandlerRef;

    // Avoid triggering autosave immediately when we populate the form with the draft.
    isApplyingDraftRef.current = true;

    if (draftBehandler) {
      setSelectedBehandler(draftBehandler);
    }

    const nextBehandlerRef = draftBehandlerRef ?? getValues("behandlerRef");

    reset({
      ...getValues(),
      meldingTekst: draft.tekst,
      // Optional fields (only set if present to not override current user choices)
      meldingsType:
        (draft.meldingsType as MeldingType) ?? getValues("meldingsType"),
      behandlerRef: nextBehandlerRef,
      // Do NOT set behandlerRefSelection here. VelgBehandler derives list vs search
      // based on behandlerRef and the fetched behandler list.
    });

    if (nextBehandlerRef) {
      setValue("behandlerRef", nextBehandlerRef, { shouldValidate: true });
    }

    // Do NOT set behandlerRefSelection here. Avoid flipping list selections into search
    // when draft refetch happens after autosave.

    const id = window.setTimeout(() => {
      isApplyingDraftRef.current = false;
    }, 0);

    return () => {
      window.clearTimeout(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftQuery.data, reset]);

  const utkastSavedText = (savedDate: Date) => {
    return `${texts.utkastSaved} ${showTimeIncludingSeconds(savedDate)}`;
  };

  useEffect(() => {
    const meldingTekst = watchedMeldingTekst;
    const meldingsType = watchedMeldingsType;

    if (isApplyingDraftRef.current) {
      return;
    }

    if (autosaveTimeoutRef.current) {
      window.clearTimeout(autosaveTimeoutRef.current);
    }

    autosaveTimeoutRef.current = window.setTimeout(() => {
      saveDraft.mutate(
        {
          tekst: meldingTekst,
          meldingsType: meldingsType || undefined,
          behandler: selectedBehandler,
        },
        {
          onSuccess: () => {
            setShowUtkastSaved(true);
            setLastUtkastSavedTime(new Date());
          },
          onError: () => setShowUtkastSaved(false),
        }
      );
    }, 700);

    return () => {
      if (autosaveTimeoutRef.current) {
        window.clearTimeout(autosaveTimeoutRef.current);
      }
    };
  }, [saveDraft, selectedBehandler, watchedMeldingsType, watchedMeldingTekst]);

  const submit = (values: MeldingTilBehandlerSkjemaValues) => {
    const effectiveBehandlerRef =
      selectedBehandler?.behandlerRef ?? values.behandlerRef;

    const meldingTilBehandlerDTO: MeldingTilBehandlerDTO = {
      type: values.meldingsType,
      behandlerRef: effectiveBehandlerRef,
      tekst: values.meldingTekst,
      document: getMeldingTilBehandlerDocument(values),
      behandlerIdent: selectedBehandler?.fnr,
      behandlerNavn: selectedBehandler
        ? behandlerNavn(selectedBehandler)
        : undefined,
    };

    meldingTilBehandler.mutate(meldingTilBehandlerDTO, {
      onSuccess: () => {
        // Prevent autosave from re-creating the draft while we clear UI + delete draft.
        isApplyingDraftRef.current = true;
        if (autosaveTimeoutRef.current) {
          window.clearTimeout(autosaveTimeoutRef.current);
        }

        // Clear UI
        reset({
          behandlerRef: "",
          behandlerRefSelection: undefined,
          meldingsType: "" as unknown as MeldingType,
          meldingTekst: "",
        });
        setSelectedBehandler(undefined);
        setDisplayPreview(false);
        setShowUtkastSaved(false);
        setLastUtkastSavedTime(undefined);

        // Delete draft in Valkey
        deleteDraft.mutate(undefined, {
          onSettled: () => {
            window.setTimeout(() => {
              isApplyingDraftRef.current = false;
            }, 0);
          },
        });
      },
    });
  };

  const MeldingTypeOption = ({ type }: { type: MeldingType }) => (
    <option value={type}>{meldingTypeTexts[type]}</option>
  );

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(submit)} className={"flex flex-col gap-4"}>
        {meldingTilBehandler.isSuccess && (
          <Alert variant="success" size="small">
            {`Meldingen ble sendt ${tilDatoMedManedNavnOgKlokkeslett(now)}`}
          </Alert>
        )}
        <div className="max-w-[23rem]">
          <Select
            id="type"
            className="mb-4"
            size="small"
            label={texts.meldingsType.label}
            {...register("meldingsType", { required: true })}
            value={watch("meldingsType")}
            error={errors.meldingsType && texts.meldingsType.missing}
          >
            <option value="">{texts.meldingsType.defaultOption}</option>
            <MeldingTypeOption
              type={MeldingType.FORESPORSEL_PASIENT_TILLEGGSOPPLYSNINGER}
            />
            <MeldingTypeOption
              type={MeldingType.FORESPORSEL_PASIENT_LEGEERKLARING}
            />
            <MeldingTypeOption type={MeldingType.HENVENDELSE_MELDING_FRA_NAV} />
          </Select>
          {watch("meldingsType") && (
            <MeldingsTypeInfo meldingType={watch("meldingsType")} />
          )}
        </div>
        <VelgBehandler
          onBehandlerSelected={setSelectedBehandler}
          selectedBehandler={selectedBehandler}
          legend={texts.velgBehandlerLegend}
        />
        <Textarea
          label={texts.meldingsTekstLabel}
          {...register("meldingTekst", {
            required: true,
            maxLength: MAX_LENGTH_BEHANDLER_MELDING,
          })}
          maxLength={MAX_LENGTH_BEHANDLER_MELDING}
          error={meldingTekstErrorMessage}
          size="small"
          minRows={4}
        />
        <ForhandsvisningModal
          contentLabel={texts.previewContentLabel}
          isOpen={displayPreview}
          handleClose={() => setDisplayPreview(false)}
          getDocumentComponents={() =>
            getMeldingTilBehandlerDocument(getValues()) ?? []
          }
        />
        {showUtkastSaved && lastUtkastSavedTime && (
          <div className="mb-2 font-bold flex gap-2">
            <img src={SaveFile} alt="saved" />
            <span>{utkastSavedText(lastUtkastSavedTime)}</span>
          </div>
        )}
        <ButtonRow>
          <Button
            variant="primary"
            onClick={handleSubmit(submit)}
            loading={meldingTilBehandler.isPending}
            type="submit"
          >
            {texts.sendKnapp}
          </Button>
          <PreviewButton onClick={setDisplayPreview} />
        </ButtonRow>
      </form>
    </FormProvider>
  );
};
