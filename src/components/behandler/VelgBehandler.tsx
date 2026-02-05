import React, { useEffect, useRef, useState } from "react";
import { BehandlerDTO } from "@/data/behandler/BehandlerDTO";
import AppSpinner from "@/components/AppSpinner";
import { useBehandlereQuery } from "@/data/behandler/behandlereQueryHooks";
import { HelpText, Radio, RadioGroup } from "@navikt/ds-react";
import BehandlerSearch from "@/components/behandler/BehandlerSearch";
import { behandlerDisplayText } from "@/utils/behandlerUtils";
import { useController, useFormContext } from "react-hook-form";

export const BEHANDLER_REF_NONE = "__NONE__";
export const BEHANDLER_REF_SEARCH_PREFIX = "__SEARCH__";

const texts = {
  sokEtterBehandlerHelpText:
    "Du kan søke etter behandlerens fornavn, etternavn, kontornavn og organisasjonsnummeret til kontoret. Søk gjerne med flere av disse samtidig. Finner du ikke behandleren du leter etter? Da bør du melde det inn i Porten.",
  sokEtterBehandlerHelpTextTitle: "Hva kan jeg søke etter her?",
  behandlerSearchOptionText: "Søk etter behandler",
  behandlerMissing: "Vennligst velg behandler",
};

interface VelgBehandlerProps {
  legend: string;
  onBehandlerSelected: (behandler: BehandlerDTO) => void;
}

export const VelgBehandler = ({
  legend,
  onBehandlerSelected,
}: VelgBehandlerProps) => {
  const { data: behandlere, isLoading } = useBehandlereQuery();
  const { setValue } = useFormContext();
  const { field, fieldState } = useController({
    name: "behandlerRef",
    rules: {
      validate: (value) =>
        (value && value !== BEHANDLER_REF_NONE && value !== "") ||
        texts.behandlerMissing,
    },
  });
  const [showBehandlerSearch, setShowBehandlerSearch] =
    useState<boolean>(false);
  const selectedBehandlerFromSearchRef = useRef<BehandlerDTO | undefined>(
    undefined
  );

  const handleSetSelectedBehandlerFromSearch = (
    behandler: BehandlerDTO | undefined
  ) => {
    if (behandler) {
      selectedBehandlerFromSearchRef.current = behandler;
      setValue(
        "behandlerRef",
        `${BEHANDLER_REF_SEARCH_PREFIX}${behandler.behandlerRef}`,
        {
          shouldValidate: true,
          shouldDirty: true,
        }
      );
      onBehandlerSelected(behandler);
    }
  };

  useEffect(() => {
    setShowBehandlerSearch(
      field.value === "" || field.value.startsWith(BEHANDLER_REF_SEARCH_PREFIX)
    );

    if (
      field.value &&
      field.value !== "" &&
      field.value !== BEHANDLER_REF_NONE
    ) {
      if (field.value.startsWith(BEHANDLER_REF_SEARCH_PREFIX)) {
        if (selectedBehandlerFromSearchRef.current) {
          onBehandlerSelected(selectedBehandlerFromSearchRef.current);
        }
      } else {
        const matchingBehandler = behandlere.find(
          (b) => b.behandlerRef === field.value
        );
        if (matchingBehandler) {
          onBehandlerSelected(matchingBehandler);
        }
      }
    }
  }, [field.value, behandlere, onBehandlerSelected]);

  return isLoading ? (
    <AppSpinner />
  ) : (
    <RadioGroup
      legend={legend}
      error={fieldState.error?.message}
      size="small"
      value={
        field.value?.startsWith(BEHANDLER_REF_SEARCH_PREFIX)
          ? ""
          : field.value || ""
      }
      onChange={field.onChange}
    >
      {behandlere.map((behandler, index) => (
        <Radio key={index} value={behandler.behandlerRef}>
          {behandlerDisplayText(behandler)}
        </Radio>
      ))}
      <Radio value="">{texts.behandlerSearchOptionText}</Radio>
      {showBehandlerSearch && (
        <div className="flex flex-row items-center">
          <BehandlerSearch
            setSelectedBehandler={handleSetSelectedBehandlerFromSearch}
          />
          <HelpText
            title={texts.sokEtterBehandlerHelpTextTitle}
            className="ml-1"
          >
            {texts.sokEtterBehandlerHelpText}
          </HelpText>
        </div>
      )}
    </RadioGroup>
  );
};
