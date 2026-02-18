import React, { useEffect, useRef, useState } from "react";
import { Alert, Button, Select, Textarea } from "@navikt/ds-react";
import { BehandlerDTO } from "@/data/behandler/BehandlerDTO";
import {
  MeldingTilBehandlerDTO,
  MeldingType,
} from "@/data/behandlerdialog/behandlerdialogTypes";
import { useMeldingTilBehandler } from "@/data/behandlerdialog/useMeldingTilBehandler";
import { tilDatoMedManedNavnOgKlokkeslett } from "@/utils/datoUtils";
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
import {
  useDeleteMeldingTilBehandlerDraft,
  useMeldingTilBehandlerDraftQuery,
  useSaveMeldingTilBehandlerDraft,
} from "@/data/behandlerdialog/meldingtilbehandlerDraftQueryHooks";
import { useDebouncedCallback } from "use-debounce";
import { DraftSaveStatus } from "@/components/DraftSaveStatus";

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
};

export interface MeldingTilBehandlerSkjemaValues {
  behandlerRef: string;
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
  const formMethods = useForm<MeldingTilBehandlerSkjemaValues>({
    defaultValues: {
      meldingType: "" as any,
      meldingTekst: "",
    },
  });
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue,
  } = formMethods;

  const queryClient = useQueryClient();

  const getMeldingTilBehandlerDraftQuery = useMeldingTilBehandlerDraftQuery();
  const saveDraft = useSaveMeldingTilBehandlerDraft();
  const deleteDraft = useDeleteMeldingTilBehandlerDraft();
  const lastSavedDraftJsonRef = useRef<string>("");

  const debouncedAutoSaveDraft = useDebouncedCallback(
    (values: MeldingTilBehandlerSkjemaValues) => {
      const draftPayload = {
        tekst: values.meldingTekst ?? "",
        meldingType: values.meldingType,
      };

      if (!draftPayload.tekst && !draftPayload.meldingType) {
        return;
      }

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
    if (!!getMeldingTilBehandlerDraftQuery.data?.tekst) {
      setValue("meldingTekst", getMeldingTilBehandlerDraftQuery.data.tekst);
    }
    getMeldingTilBehandlerDraftQuery.data?.meldingType &&
      setValue(
        "meldingType",
        getMeldingTilBehandlerDraftQuery.data.meldingType as MeldingType
      );
  }, [getMeldingTilBehandlerDraftQuery.data, setValue]);

  const meldingTekstErrorMessage =
    errors.meldingTekst &&
    getValues("meldingTekst") === "" &&
    texts.meldingsTekstMissing;

  const submit = (values: MeldingTilBehandlerSkjemaValues) => {
    if (!selectedBehandler) {
      return;
    }

    const meldingTilBehandlerDTO: MeldingTilBehandlerDTO = {
      type: values.meldingType,
      behandlerRef: selectedBehandler.behandlerRef,
      tekst: values.meldingTekst,
      document: getMeldingTilBehandlerDocument(values),
      behandlerIdent: selectedBehandler.fnr,
      behandlerNavn: behandlerNavn(selectedBehandler),
    };

    meldingTilBehandler.mutate(meldingTilBehandlerDTO, {
      onSuccess: () => {
        setMeldingSentTime(new Date());
        lastSavedDraftJsonRef.current = "";
        setUtkastSavedTime(undefined);
        setSelectedBehandler(undefined);
        debouncedAutoSaveDraft.cancel();

        queryClient.cancelQueries({
          queryKey: ["draft", "behandlerdialog-meldingtilbehandler"],
        });

        queryClient.setQueryData(
          ["draft", "behandlerdialog-meldingtilbehandler"],
          null
        );

        reset();

        deleteDraft.mutate(undefined, {
          onSettled: () => {
            queryClient.setQueryData(
              ["draft", "behandlerdialog-meldingtilbehandler"],
              null
            );
          },
        });
      },
    });
  };

  const MeldingTypeOption = ({ type }: { type: MeldingType }) => (
    <option value={type}>{meldingTypeTexts[type]}</option>
  );

  const meldingType = watch("meldingType");
  const meldingTekst = watch("meldingTekst");

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={handleSubmit(submit)}
        onChange={() => debouncedAutoSaveDraft(getValues())}
        className={"flex flex-col gap-4"}
      >
        {meldingSentTime && (
          <Alert variant="success" size="small">
            {`Meldingen ble sendt ${tilDatoMedManedNavnOgKlokkeslett(
              meldingSentTime
            )}`}
          </Alert>
        )}
        <div className="max-w-[23rem]">
          <Select
            id="type"
            className="mb-4"
            size="small"
            label={texts.meldingType.label}
            {...register("meldingType", { required: true })}
            value={meldingType}
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
          {meldingType && <MeldingsTypeInfo meldingType={meldingType} />}
        </div>
        <VelgBehandler
          key={meldingSentTime?.getTime() || "initial"}
          onBehandlerSelected={setSelectedBehandler}
          legend={texts.velgBehandlerLegend}
        />
        <Textarea
          label={texts.meldingsTekstLabel}
          {...register("meldingTekst", {
            required: true,
            maxLength: MAX_LENGTH_BEHANDLER_MELDING,
          })}
          value={meldingTekst}
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
        <DraftSaveStatus
          isSaveError={saveDraft.isError}
          savedTime={utkastSavedTime}
        />
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
