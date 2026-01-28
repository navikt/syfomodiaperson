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

  const { field: behandlerRefSokField } = useController({
    name: "behandlerRefSok",
  });

  const { field: isBehandlerSokSelectedField } = useController({
    name: "isBehandlerSokSelected",
    defaultValue: false,
  });

  const { field, fieldState } = useController({
    name: "behandlerRef",
    rules: {
      validate: (value) => {
        const isBehandlerSokSelected = !!isBehandlerSokSelectedField.value;

        if (isBehandlerSokSelected) {
          return !!behandlerRefSokField.value || texts.behandlerMissing;
        }

        return !!value || texts.behandlerMissing;
      },
    },
  });

  const watchedBehandlerRef = useWatch({ name: "behandlerRef" });

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

  const isBehandlerSokSelected = !!isBehandlerSokSelectedField.value;

  const handleSetSelectedBehandler = (behandler: BehandlerDTO | undefined) => {
    if (!behandler) {
      return;
    }

    setValue("behandlerRef", undefined);
    setValue("behandlerRefSok", behandler.behandlerRef, { shouldDirty: true });
    setValue("isBehandlerSokSelected", true);

    onBehandlerSelected(behandler);
  };

  const selectedBehandlerRefValue = field.value ?? undefined;

  const isSubmitted = formState.submitCount > 0;

  return isLoading ? (
    <AppSpinner />
  ) : (
    <RadioGroup
      legend={legend}
      name="behandlerRef"
      error={isSubmitted ? fieldState.error?.message : undefined}
      size="small"
      value={selectedBehandlerRefValue}
    >
      {behandlere.map((behandler, index) => (
        <Radio
          key={index}
          value={behandler.behandlerRef}
          onChange={(event) => {
            setValue("behandlerRefSok", undefined);
            setValue("isBehandlerSokSelected", false);
            onBehandlerSelected(behandler);
            field.onChange(event);
          }}
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
          <BehandlerSearch setSelectedBehandler={handleSetSelectedBehandler} />
          <HelpText
            title={texts.sokEtterBehandlerHelpTextTitle}
            className="ml-1"
          >
            {texts.sokEtterBehandlerHelpText}
          </HelpText>
          <input
            type="hidden"
            aria-label="behandlerRefSok"
            {...behandlerRefSokField}
          />
        </div>
      )}
    </RadioGroup>
  );
};
