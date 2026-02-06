import React, { useEffect, useState } from "react";
import { Alert, Button, Select, Textarea } from "@navikt/ds-react";
import { BehandlerDTO } from "@/data/behandler/BehandlerDTO";
import {
  MeldingTilBehandlerDTO,
  MeldingType,
} from "@/data/behandlerdialog/behandlerdialogTypes";
import { useSendMeldingTilBehandler } from "@/data/behandlerdialog/useSendMeldingTilBehandler";
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
  useGetMeldingTilBehandlerDraftQuery,
  useSaveMeldingTilBehandlerDraft,
} from "@/data/behandlerdialog/meldingtilbehandlerDraftQueryHooks";
import { useDebouncedCallback } from "use-debounce";

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
  behandlerRef: string;
  meldingType: MeldingType;
  meldingTekst: string;
}

export const MAX_LENGTH_BEHANDLER_MELDING = 5000;

export const MeldingTilBehandlerSkjema = () => {
  const [displayPreview, setDisplayPreview] = useState(false);
  const [utkastSavedTime, setUtkastSavedTime] = useState<Date>();
  const [selectedBehandler, setSelectedBehandler] = useState<BehandlerDTO>();
  const { getMeldingTilBehandlerDocument } = useMeldingTilBehandlerDocument();
  const sendMeldingTilBehandler = useSendMeldingTilBehandler();
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
    setValue,
    reset,
    getValues,
  } = formMethods;

  const now = new Date();
  const queryClient = useQueryClient();

  const getMeldingTilBehandlerDraftQuery =
    useGetMeldingTilBehandlerDraftQuery();
  const saveDraft = useSaveMeldingTilBehandlerDraft();
  const deleteDraft = useDeleteMeldingTilBehandlerDraft();

  const debouncedAutoSaveDraft = useDebouncedCallback(
    (values: MeldingTilBehandlerSkjemaValues) => {
      const draftPayload = {
        tekst: values.meldingTekst ?? "",
        meldingType: values.meldingType,
        behandlerRef: values.behandlerRef,
      };

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
    if (getMeldingTilBehandlerDraftQuery.data) {
      setValue("meldingTekst", getMeldingTilBehandlerDraftQuery.data.tekst);
    }
  }, [getMeldingTilBehandlerDraftQuery.data, setValue]);

  const meldingTekstErrorMessage =
    errors.meldingTekst &&
    getValues("meldingTekst") === "" &&
    texts.meldingsTekstMissing;

  const utkastSavedText = (savedDate: Date) => {
    return `${texts.utkastSaved} ${showTimeIncludingSeconds(savedDate)}`;
  };

  const submit = (values: MeldingTilBehandlerSkjemaValues) => {
    const meldingTilBehandlerDTO: MeldingTilBehandlerDTO = {
      type: values.meldingType,
      behandlerRef: values.behandlerRef,
      tekst: values.meldingTekst,
      document: getMeldingTilBehandlerDocument(values),
      behandlerIdent: selectedBehandler?.fnr,
      behandlerNavn: selectedBehandler
        ? behandlerNavn(selectedBehandler)
        : undefined,
    };

    sendMeldingTilBehandler.mutate(meldingTilBehandlerDTO, {
      onSuccess: () => {
        setUtkastSavedTime(undefined);
        setSelectedBehandler(undefined);
        debouncedAutoSaveDraft.cancel();

        queryClient.invalidateQueries({
          queryKey: ["meldingtilbehandlerDraft"],
        });

        deleteDraft.mutate(undefined);
        reset();
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
        className={"flex flex-col gap-4"}
        onChange={() => debouncedAutoSaveDraft(getValues())}
      >
        {sendMeldingTilBehandler.isSuccess && (
          <Alert variant="success" size="small">
            {`Meldingen ble sendt ${tilDatoMedManedNavnOgKlokkeslett(now)}`}
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
            loading={sendMeldingTilBehandler.isPending}
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
