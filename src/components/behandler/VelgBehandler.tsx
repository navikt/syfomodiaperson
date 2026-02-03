import React, { useEffect } from "react";
import { BehandlerDTO } from "@/data/behandler/BehandlerDTO";
import AppSpinner from "@/components/AppSpinner";
import { useBehandlereQuery } from "@/data/behandler/behandlereQueryHooks";
import { HelpText, Radio, RadioGroup } from "@navikt/ds-react";
import BehandlerSearch from "@/components/behandler/BehandlerSearch";
import { behandlerDisplayText } from "@/utils/behandlerUtils";
import { useController, useFormContext, useWatch } from "react-hook-form";

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
  const { setValue, formState } = useFormContext();

  const behandlerRefSok = useWatch({ name: "behandlerRefSok" });
  const isBehandlerSokSelected = useWatch({ name: "isBehandlerSokSelected" });
  const watchedBehandlerRef = useWatch({ name: "behandlerRef" });

  const { field, fieldState } = useController({
    name: "behandlerRef",
    rules: {
      validate: (value) => {
        if (isBehandlerSokSelected) {
          return !!behandlerRefSok || texts.behandlerMissing;
        }

        return !!value || texts.behandlerMissing;
      },
    },
  });

  useEffect(() => {
    if (!behandlere?.length || !watchedBehandlerRef) {
      return;
    }

    const matchingBehandler = behandlere.find(
      (behandler) => behandler.behandlerRef === watchedBehandlerRef
    );

    if (!matchingBehandler) {
      return;
    }

    onBehandlerSelected(matchingBehandler);
  }, [behandlere, onBehandlerSelected, watchedBehandlerRef]);

  function handleSetSokBehandlerSelected(behandler: BehandlerDTO | undefined) {
    if (!behandler) {
      return;
    }

    setValue("behandlerRef", undefined);
    setValue("behandlerRefSok", behandler.behandlerRef, { shouldDirty: true });
    setValue("isBehandlerSokSelected", true);

    onBehandlerSelected(behandler);
  }

  function handleSetListedBehandlerSelected(
    behandler: BehandlerDTO,
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setValue("behandlerRefSok", undefined);
    setValue("isBehandlerSokSelected", false);
    onBehandlerSelected(behandler);
    field.onChange(event);
  }

  return isLoading ? (
    <AppSpinner />
  ) : (
    <RadioGroup
      legend={legend}
      name="behandlerRef"
      error={formState.submitCount > 0 ? fieldState.error?.message : undefined}
      size="small"
      value={field.value}
    >
      {behandlere.map((behandler) => (
        <Radio
          key={behandler.behandlerRef}
          value={behandler.behandlerRef}
          onChange={(event) =>
            handleSetListedBehandlerSelected(behandler, event)
          }
        >
          {behandlerDisplayText(behandler)}
        </Radio>
      ))}
      <Radio
        value={"__SOK__"}
        checked={isBehandlerSokSelected}
        onChange={() => {
          setValue("behandlerRef", undefined);
          setValue("isBehandlerSokSelected", true);
        }}
      >
        {texts.behandlerSearchOptionText}
      </Radio>
      {isBehandlerSokSelected && (
        <div className="flex flex-row items-center">
          <BehandlerSearch
            setSelectedBehandler={handleSetSokBehandlerSelected}
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
