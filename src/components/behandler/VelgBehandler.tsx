import React, { useEffect, useState } from "react";
import { BehandlerDTO, BehandlerType } from "@/data/behandler/BehandlerDTO";
import AppSpinner from "@/components/AppSpinner";
import { useBehandlereQuery } from "@/data/behandler/behandlereQueryHooks";
import { HelpText, Radio, RadioGroup } from "@navikt/ds-react";
import BehandlerSearch from "@/components/behandler/BehandlerSearch";
import { behandlerDisplayText } from "@/utils/behandlerUtils";
import { useController, useFormContext } from "react-hook-form";
const texts = {
  sokEtterBehandlerHelpText:
    "Du kan søke etter behandlerens fornavn, etternavn, kontornavn og organisasjonsnummeret til kontoret. Søk gjerne med flere av disse samtidig. Finner du ikke behandleren du leter etter? Da bør du melde det inn i Porten.",
  sokEtterBehandlerHelpTextTitle: "Hva kan jeg søke etter her?",
  behandlerSearchOptionText: "Søk etter behandler",
  behandlerMissing: "Vennligst velg behandler",
};

interface VelgBehandlerProps {
  legend: string;
  onBehandlerSelected: (behandler?: BehandlerDTO) => void;

  /**
   * Optional currently selected behandler (e.g. from draft hydration).
   */
  selectedBehandler?: BehandlerDTO;
}
export const VelgBehandler = ({
  legend,
  onBehandlerSelected,
  selectedBehandler,
}: VelgBehandlerProps) => {
  const { data: behandlere, isLoading } = useBehandlereQuery();
  const [showBehandlerSearch, setShowBehandlerSearch] =
    useState<boolean>(false);
  const [selectedBehandlerForSearch, setSelectedBehandlerForSearch] = useState<
    BehandlerDTO | undefined
  >(undefined);
  const { setValue } = useFormContext();

  const { field: behandlerRefField, fieldState: behandlerRefFieldState } =
    useController({
      name: "behandlerRef",
      rules: {
        required: texts.behandlerMissing,
      },
    });

  // Separate field used ONLY for controlling which radio is checked.
  // undefined means "no radio selected yet".
  // "" means the search option.
  const { field: behandlerRefSelectionField } = useController({
    name: "behandlerRefSelection",
    defaultValue: undefined,
  });

  useEffect(() => {
    if (!selectedBehandler) {
      return;
    }

    // Only hydrate the search input if we're actually in search-mode.
    // Otherwise a list-selected behandler could later show up "mystically" in the search field.
    if (behandlerRefSelectionField.value !== "") {
      return;
    }

    setSelectedBehandlerForSearch(selectedBehandler);
  }, [behandlerRefSelectionField.value, selectedBehandler]);

  useEffect(() => {
    const currentBehandlerRef = behandlerRefField.value;
    if (!currentBehandlerRef) {
      return;
    }

    const isInList = behandlere.some(
      (behandler) => behandler.behandlerRef === currentBehandlerRef
    );

    // If user is in search mode, do not override radio selection.
    if (behandlerRefSelectionField.value === "") {
      setShowBehandlerSearch(true);
      return;
    }

    if (isInList) {
      // When we have a list selection (incl. rehydration), keep radio selection in sync
      // and make sure search UI/state is cleared.
      setShowBehandlerSearch(false);
      setSelectedBehandlerForSearch(undefined);

      setValue("behandlerRefSelection", currentBehandlerRef, {
        shouldValidate: false,
      });
      return;
    }

    // When selection is NOT in list (rehydrated search-behandler), select search option.
    setValue("behandlerRefSelection", "", { shouldValidate: false });
    setShowBehandlerSearch(true);
  }, [
    behandlere,
    behandlerRefField.value,
    behandlerRefSelectionField.value,
    setValue,
  ]);

  const handleSetSelectedBehandler = (behandler: BehandlerDTO | undefined) => {
    if (!behandler) {
      return;
    }

    const normalisedBehandler: BehandlerDTO = {
      ...behandler,
      // Some search results may return type as null/undefined. Draft storage expects a string.
      // Use a safe default for rehydration/display.
      type: behandler.type ?? BehandlerType.SYKMELDER,
    };

    setSelectedBehandlerForSearch(normalisedBehandler);

    // Store the real selection for submit/autosave.
    setValue("behandlerRef", normalisedBehandler.behandlerRef, {
      shouldValidate: true,
    });

    // Keep the UI in "search" mode after selecting from search.
    setShowBehandlerSearch(true);
    setValue("behandlerRefSelection", "", { shouldValidate: false });

    onBehandlerSelected(normalisedBehandler);
  };

  const handleRadioChange = (value: string) => {
    behandlerRefSelectionField.onChange(value);

    if (value === "") {
      // User chose search: show search UI and clear the actual selection
      // until a result is picked.
      setShowBehandlerSearch(true);
      setSelectedBehandlerForSearch(undefined);
      setValue("behandlerRef", "", { shouldValidate: true });
      onBehandlerSelected(undefined);
      return;
    }

    // User chose list: hide search UI and clear search state.
    setShowBehandlerSearch(false);
    setSelectedBehandlerForSearch(undefined);

    // Store the actual selection.
    setValue("behandlerRef", value, { shouldValidate: true });

    const selectedFromList = behandlere.find(
      (behandler) => behandler.behandlerRef === value
    );
    if (selectedFromList) {
      onBehandlerSelected(selectedFromList);
    }
  };

  return isLoading ? (
    <AppSpinner />
  ) : (
    <RadioGroup
      legend={legend}
      name={behandlerRefSelectionField.name}
      value={behandlerRefSelectionField.value}
      onChange={handleRadioChange}
      error={behandlerRefFieldState.error?.message}
      size="small"
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
            setSelectedBehandler={handleSetSelectedBehandler}
            selectedBehandler={
              behandlerRefSelectionField.value === ""
                ? selectedBehandlerForSearch
                : undefined
            }
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
