import React, { useEffect, useRef, useState } from "react";
import { Alert, Button, Select, Textarea } from "@navikt/ds-react";
import { BehandlerDTO } from "@/data/behandler/BehandlerDTO";
import {
  MeldingTilBehandlerDTO,
  MeldingType,
} from "@/data/behandlerdialog/behandlerdialogTypes";
import { useMeldingTilBehandler } from "@/data/behandlerdialog/useMeldingTilBehandler";
import {
  showTimeIncludingSeconds,
  tilDatoMedManedNavnOgKlokkeslett,
} from "@/utils/datoUtils";
import { useMeldingTilBehandlerDocument } from "@/hooks/behandlerdialog/document/useMeldingTilBehandlerDocument";
import { behandlerNavn } from "@/utils/behandlerUtils";
import { MeldingsTypeInfo } from "@/sider/behandlerdialog/meldingtilbehandler/MeldingsTypeInfo";
import { FormProvider, useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { meldingTypeTexts } from "@/data/behandlerdialog/behandlerdialogTexts";
import { ButtonRow } from "@/components/Layout";
import { ForhandsvisningModal } from "@/components/ForhandsvisningModal";
import { VelgBehandler } from "@/components/behandler/VelgBehandler";
import { PreviewButton } from "@/sider/behandlerdialog/meldingtilbehandler/PreviewButton";
import { SaveFile } from "../../../../img/ImageComponents";
import {
  useDeleteMeldingTilBehandlerDraft,
  useMeldingTilBehandlerDraftQuery,
  useSaveMeldingTilBehandlerDraft,
} from "@/data/behandlerdialog/meldingtilbehandlerDraftQueryHooks";

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
  utkastSaveFailed: "Lagring av utkast feilet",
};

export interface MeldingTilBehandlerSkjemaValues {
  behandlerRef?: string;
  behandlerRefSok?: string;
  isBehandlerSokSelected?: boolean;
  meldingsType: MeldingType;
  meldingTekst: string;
}

export const MAX_LENGTH_BEHANDLER_MELDING = 5000;

export const MeldingTilBehandlerSkjema = () => {
  const [displayPreview, setDisplayPreview] = useState(false);
  const [showUtkastSaved, setShowUtkastSaved] = useState(false);
  const [lastUtkastSavedTime, setLastUtkastSavedTime] = useState<Date>();
  const [hasUtkastSaveFailed, setHasUtkastSaveFailed] = useState(false);
  const [lastMeldingSentTime, setLastMeldingSentTime] = useState<Date>();
  const [hasClearedAfterSend, setHasClearedAfterSend] = useState(false);
  const { getMeldingTilBehandlerDocument } = useMeldingTilBehandlerDocument();
  const [selectedBehandler, setSelectedBehandler] = useState<BehandlerDTO>();
  const meldingTilBehandler = useMeldingTilBehandler();
  const formMethods = useForm<MeldingTilBehandlerSkjemaValues>({
    defaultValues: {
      behandlerRef: undefined,
      behandlerRefSok: undefined,
      isBehandlerSokSelected: false,
      meldingTekst: "",
    },
  });
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    getValues,
  } = formMethods;

  const queryClient = useQueryClient();

  const { data: draft } = useMeldingTilBehandlerDraftQuery();
  const saveDraft = useSaveMeldingTilBehandlerDraft();
  const deleteDraft = useDeleteMeldingTilBehandlerDraft();
  const hasHydratedDraftRef = useRef(false);
  const lastSavedDraftJsonRef = useRef<string>("");

  const watchedValues = watch([
    "meldingTekst",
    "meldingsType",
    "behandlerRef",
    "behandlerRefSok",
  ]);

  useEffect(() => {
    if (!isDirty) {
      return;
    }

    const [meldingTekst, meldingsType, behandlerRef, behandlerRefSok] =
      watchedValues;

    const timeoutId = window.setTimeout(() => {
      const draftPayload = {
        tekst: meldingTekst ?? "",
        meldingsType: meldingsType,
        behandlerRef: behandlerRef || behandlerRefSok || undefined,
      };

      const draftJson = JSON.stringify(draftPayload);
      if (draftJson === lastSavedDraftJsonRef.current) {
        return;
      }

      lastSavedDraftJsonRef.current = draftJson;
      saveDraft.mutate(draftPayload, {
        onSuccess: () => {
          setHasUtkastSaveFailed(false);
          setShowUtkastSaved(true);
          setLastUtkastSavedTime(new Date());
        },
        onError: () => {
          setShowUtkastSaved(false);
          setLastUtkastSavedTime(undefined);
          setHasUtkastSaveFailed(true);
        },
      });
    }, 750);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isDirty, saveDraft, watchedValues]);

  useEffect(() => {
    if (
      hasClearedAfterSend ||
      !draft ||
      hasHydratedDraftRef.current ||
      isDirty
    ) {
      return;
    }

    hasHydratedDraftRef.current = true;

    const meldingsType = Object.values(MeldingType).includes(
      draft.meldingType as MeldingType
    )
      ? (draft.meldingType as MeldingType)
      : undefined;

    reset({
      meldingTekst: draft.tekst,
      meldingsType,
      behandlerRef: draft.behandlerRef ?? undefined,
      behandlerRefSok: undefined,
      isBehandlerSokSelected: false,
    });
  }, [draft, hasClearedAfterSend, isDirty, reset]);

  const meldingTekstErrorMessage =
    errors.meldingTekst &&
    getValues("meldingTekst") === "" &&
    texts.meldingsTekstMissing;

  const utkastSavedText = (savedDate: Date) => {
    return `${texts.utkastSaved} ${showTimeIncludingSeconds(savedDate)}`;
  };

  const submit = (values: MeldingTilBehandlerSkjemaValues) => {
    const behandlerRefToUse =
      values.behandlerRef || values.behandlerRefSok || undefined;

    if (!behandlerRefToUse) {
      return;
    }

    const meldingTilBehandlerDTO: MeldingTilBehandlerDTO = {
      type: values.meldingsType,
      behandlerRef: behandlerRefToUse,
      tekst: values.meldingTekst,
      document: getMeldingTilBehandlerDocument(values),
      behandlerIdent: selectedBehandler?.fnr,
      behandlerNavn: selectedBehandler
        ? behandlerNavn(selectedBehandler)
        : undefined,
    };

    meldingTilBehandler.mutate(meldingTilBehandlerDTO, {
      onSuccess: () => {
        setLastMeldingSentTime(new Date());

        setHasClearedAfterSend(true);
        hasHydratedDraftRef.current = true;
        lastSavedDraftJsonRef.current = "";
        setHasUtkastSaveFailed(false);
        setShowUtkastSaved(false);
        setLastUtkastSavedTime(undefined);
        setSelectedBehandler(undefined);
        reset();

        queryClient.setQueriesData(
          { queryKey: ["meldingtilbehandlerDraft"] },
          undefined
        );

        deleteDraft.mutate(undefined);
      },
    });
  };

  const MeldingTypeOption = ({ type }: { type: MeldingType }) => (
    <option value={type}>{meldingTypeTexts[type]}</option>
  );

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(submit)} className={"flex flex-col gap-4"}>
        {lastMeldingSentTime && (
          <Alert variant="success" size="small">
            {`Meldingen ble sendt ${tilDatoMedManedNavnOgKlokkeslett(
              lastMeldingSentTime
            )}`}
          </Alert>
        )}
        {hasUtkastSaveFailed && (
          <Alert variant="error" size="small">
            {texts.utkastSaveFailed}
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
