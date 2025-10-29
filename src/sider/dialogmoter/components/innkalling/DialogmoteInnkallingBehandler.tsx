import React, { ReactElement, useEffect, useState } from "react";
import AppSpinner from "@/components/AppSpinner";
import { BehandlerDTO } from "@/data/behandler/BehandlerDTO";
import { useBehandlereQuery } from "@/data/behandler/behandlereQueryHooks";
import { ErrorMessage, Radio, RadioGroup } from "@navikt/ds-react";
import { behandlerDisplayText } from "@/utils/behandlerUtils";
import BehandlerSearch from "@/components/behandler/BehandlerSearch";
import { useController } from "react-hook-form";
import { DialogmoteInnkallingSkjemaValues } from "@/sider/dialogmoter/components/innkalling/DialogmoteInnkallingSkjema";

export const texts = {
  title: "Behandler",
  legekontor: "Legekontor",
  tlf: "Telefonnummer",
  noBehandler: "Ingen behandler",
  behandlerMissing: "Vennligst velg behandler",
  behandlerRadioNotClicked: "Vennligst velg ett alternativ",
};

const behandlerRadioGruppeTexts = {
  behandlerLegend: "Behandler",
  behandlerDescription: "Behandleren vil få en dialogmelding med invitasjon.",
  behandlersokTekst: "Legg til en behandler",
};

interface DialogmoteInnkallingBehandlerProps {
  setSelectedBehandler: (behandler?: BehandlerDTO) => void;
  selectedbehandler?: BehandlerDTO;
}

function behandlerRefValidationErrors(
  behandlerRef: string | undefined,
  hasClickedBehandlerRadio: boolean
) {
  if (!hasClickedBehandlerRadio) {
    return texts.behandlerRadioNotClicked;
  }

  if (!behandlerRef) {
    return texts.behandlerMissing;
  }
  return undefined;
}

const DialogmoteInnkallingBehandler = ({
  setSelectedBehandler,
  selectedbehandler,
}: DialogmoteInnkallingBehandlerProps): ReactElement => {
  const [hasClickedBehandlerRadio, setHasClickedBehandlerRadio] =
    useState<boolean>(false);
  const { field, fieldState } = useController<
    DialogmoteInnkallingSkjemaValues,
    "behandlerRef"
  >({
    name: "behandlerRef",
    rules: {
      validate: (value) =>
        behandlerRefValidationErrors(value, hasClickedBehandlerRadio),
    },
  });

  const { data: behandlere, isLoading } = useBehandlereQuery();

  const [showBehandlerSearch, setShowBehandlerSearch] =
    useState<boolean>(false);

  useEffect(() => {
    if (!showBehandlerSearch) {
      field.onChange(selectedbehandler?.behandlerRef ?? "NONE");
    } else {
      field.onChange(selectedbehandler?.behandlerRef);
    }
  }, [
    field,
    selectedbehandler?.behandlerRef,
    showBehandlerSearch,
    hasClickedBehandlerRadio,
  ]);

  const updateBehandlerAndHideSearch = (behandler?: BehandlerDTO) => {
    setShowBehandlerSearch(false);
    setHasClickedBehandlerRadio(true);
    setSelectedBehandler(behandler);
  };

  const handleAddBehandlerRadioClick = () => {
    setShowBehandlerSearch(true);
    setHasClickedBehandlerRadio(true);
    setSelectedBehandler(undefined);
  };

  return (
    <>
      {isLoading ? (
        <AppSpinner />
      ) : (
        <>
          <RadioGroup
            legend={behandlerRadioGruppeTexts.behandlerLegend}
            description={behandlerRadioGruppeTexts.behandlerDescription}
            size="small"
          >
            <>
              <Radio
                name="behandler"
                key="ingenBehandler"
                value={undefined}
                onChange={() => updateBehandlerAndHideSearch(undefined)}
              >
                {texts.noBehandler}
              </Radio>
              {behandlere.map((behandler, index) => (
                <Radio
                  name="behandler"
                  key={index}
                  value={behandler}
                  onChange={() => updateBehandlerAndHideSearch(behandler)}
                >
                  {behandlerDisplayText(behandler)}
                </Radio>
              ))}
              <Radio
                name="behandler"
                key="-1"
                value={undefined}
                onChange={handleAddBehandlerRadioClick}
              >
                {behandlerRadioGruppeTexts.behandlersokTekst}
              </Radio>
            </>
          </RadioGroup>
          {showBehandlerSearch && (
            <BehandlerSearch
              setSelectedBehandler={setSelectedBehandler}
              label={behandlerRadioGruppeTexts.behandlersokTekst}
            />
          )}
        </>
      )}
      <ErrorMessage size="small">{fieldState.error?.message}</ErrorMessage>
    </>
  );
};

export default DialogmoteInnkallingBehandler;
