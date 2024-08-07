import React, { useState } from "react";
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
import { meldingTypeTexts } from "@/data/behandlerdialog/behandlerdialogTexts";
import { ButtonRow } from "@/components/Layout";
import { ForhandsvisningModal } from "@/components/ForhandsvisningModal";
import { VelgBehandler } from "@/components/behandler/VelgBehandler";
import { PreviewButton } from "@/sider/behandlerdialog/meldingtilbehandler/PreviewButton";

const texts = {
  sendKnapp: "Send til behandler",
  previewContentLabel: "Forhåndsvis melding til behandler",
  meldingsType: {
    label: "Hvilken meldingstype ønsker du å sende?",
    defaultOption: "Velg meldingstype",
    missing: "Vennligst velg type melding",
  },
  meldingsTekstLabel: "Skriv inn meldingstekst",
  meldingsTekstMissing: "Vennligst angi meldingstekst",
  velgBehandlerLegend: "Velg behandler som skal motta meldingen",
};

export interface MeldingTilBehandlerSkjemaValues {
  behandlerRef: string;
  meldingsType: MeldingType;
  meldingTekst: string;
}

export const MAX_LENGTH_BEHANDLER_MELDING = 5000;

export const MeldingTilBehandlerSkjema = () => {
  const [displayPreview, setDisplayPreview] = useState(false);
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
  } = formMethods;

  const now = new Date();
  const meldingTekstErrorMessage =
    errors.meldingTekst &&
    getValues("meldingTekst") === "" &&
    texts.meldingsTekstMissing;

  const submit = (values: MeldingTilBehandlerSkjemaValues) => {
    const meldingTilBehandlerDTO: MeldingTilBehandlerDTO = {
      type: values.meldingsType,
      behandlerRef: values.behandlerRef,
      tekst: values.meldingTekst,
      document: getMeldingTilBehandlerDocument(values),
      behandlerIdent: selectedBehandler?.fnr,
      behandlerNavn: selectedBehandler
        ? behandlerNavn(selectedBehandler)
        : undefined,
    };
    meldingTilBehandler.mutate(meldingTilBehandlerDTO, {
      onSuccess: () => reset(),
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
        />
        <ForhandsvisningModal
          contentLabel={texts.previewContentLabel}
          isOpen={displayPreview}
          handleClose={() => setDisplayPreview(false)}
          getDocumentComponents={() =>
            getMeldingTilBehandlerDocument(getValues()) ?? []
          }
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
