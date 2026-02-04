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
import { useDebouncedCallback } from "use-debounce";
import { useBehandlereQuery } from "@/data/behandler/behandlereQueryHooks";

const texts = {
  sendKnapp: "Send til behandler",
  previewContentLabel: "Forhåndsvis melding til behandler",
  meldingType: {
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
  meldingType: MeldingType;
  meldingTekst: string;
}

export const MAX_LENGTH_BEHANDLER_MELDING = 5000;

export const MeldingTilBehandlerSkjema = () => {
  const [displayPreview, setDisplayPreview] = useState(false);
  const [utkastSavedTime, setUtkastSavedTime] = useState<Date>();
  const [meldingSentTime, setMeldingSentTime] = useState<Date>();
  const [selectedBehandler, setSelectedBehandler] = useState<BehandlerDTO>();
  const { getMeldingTilBehandlerDocument } = useMeldingTilBehandlerDocument();
  const meldingTilBehandler = useMeldingTilBehandler();
  const { data: behandlere } = useBehandlereQuery();
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
  const lastSavedDraftJsonRef = useRef<string>("");

  const debouncedAutoSaveDraft = useDebouncedCallback(
    (values: MeldingTilBehandlerSkjemaValues) => {
      const draftPayload = {
        tekst: values.meldingTekst ?? "",
        meldingType: values.meldingType,
        behandlerRef:
          values.behandlerRef || values.behandlerRefSok || undefined,
      };

      const draftJson = JSON.stringify(draftPayload);
      if (draftJson === lastSavedDraftJsonRef.current) {
        return;
      }

      lastSavedDraftJsonRef.current = draftJson;
      saveDraft.mutate(draftPayload, {
        onSuccess: () => {
          setUtkastSavedTime(new Date());
        },
        onError: () => {
          setUtkastSavedTime(undefined);
        },
      });
    },
    750
  );

  useEffect(() => {
    if (!draft || isDirty) {
      return;
    }

    const currentMeldingTekst = getValues("meldingTekst");
    if (currentMeldingTekst !== "") {
      return;
    }

    const meldingType = Object.values(MeldingType).includes(
      draft.meldingType as MeldingType
    )
      ? (draft.meldingType as MeldingType)
      : undefined;

    reset({
      meldingTekst: draft.tekst,
      meldingType: meldingType,
      behandlerRef: draft.behandlerRef ?? undefined,
      behandlerRefSok: undefined,
      isBehandlerSokSelected: false,
    });

    // Hydrere selectedBehandler kun hvis behandleren finnes i listen (ikke søkt fram)
    if (draft.behandlerRef && behandlere.length > 0) {
      const matchingBehandler = behandlere.find(
        (b) => b.behandlerRef === draft.behandlerRef
      );
      if (matchingBehandler) {
        setSelectedBehandler(matchingBehandler);
      }
    }
  }, [draft, isDirty, reset, getValues, behandlere]);

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
      type: values.meldingType,
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
        setMeldingSentTime(new Date());

        lastSavedDraftJsonRef.current = "";
        setUtkastSavedTime(undefined);
        setSelectedBehandler(undefined);
        debouncedAutoSaveDraft.cancel();

        queryClient.setQueriesData(
          { queryKey: ["meldingtilbehandlerDraft"] },
          undefined
        );

        deleteDraft.mutate(undefined);
        reset();
      },
    });
  };

  const MeldingTypeOption = ({ type }: { type: MeldingType }) => (
    <option value={type}>{meldingTypeTexts[type]}</option>
  );

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={handleSubmit(submit)}
        onChange={() => {
          if (!isDirty) {
            return;
          }

          debouncedAutoSaveDraft(getValues());
        }}
        className={"flex flex-col gap-4"}
      >
        {meldingSentTime && (
          <Alert variant="success" size="small">
            {`Meldingen ble sendt ${tilDatoMedManedNavnOgKlokkeslett(
              meldingSentTime
            )}`}
          </Alert>
        )}
        {saveDraft.isError && (
          <Alert variant="error" size="small">
            {texts.utkastSaveFailed}
          </Alert>
        )}
        <div className="max-w-[23rem]">
          <Select
            id="type"
            className="mb-4"
            size="small"
            label={texts.meldingType.label}
            {...register("meldingType", { required: true })}
            value={watch("meldingType")}
            error={errors.meldingType && texts.meldingType.missing}
          >
            <option value="">{texts.meldingType.defaultOption}</option>
            <MeldingTypeOption
              type={MeldingType.FORESPORSEL_PASIENT_TILLEGGSOPPLYSNINGER}
            />
            <MeldingTypeOption
              type={MeldingType.FORESPORSEL_PASIENT_LEGEERKLARING}
            />
            <MeldingTypeOption type={MeldingType.HENVENDELSE_MELDING_FRA_NAV} />
          </Select>
          {watch("meldingType") && (
            <MeldingsTypeInfo meldingType={watch("meldingType")} />
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
        {utkastSavedTime && (
          <div className="mb-2 font-bold flex gap-2">
            <img src={SaveFile} alt="saved" />
            <span>{utkastSavedText(utkastSavedTime)}</span>
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
