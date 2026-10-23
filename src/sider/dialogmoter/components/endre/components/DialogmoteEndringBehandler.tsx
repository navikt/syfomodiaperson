import AppSpinner from "@/components/AppSpinner";
import BehandlerSearch from "@/components/behandler/BehandlerSearch";
import { useBehandlereQuery } from "@/data/behandler/behandlereQueryHooks";
import { EndreSkjemaValues } from "@/sider/dialogmoter/types/skjemaTypes";
import { behandlerDisplayText } from "@/utils/behandlerUtils";
import { Radio, RadioGroup } from "@navikt/ds-react";
import { ChangeEvent } from "react";
import { useController, useFormContext } from "react-hook-form";

const texts = {
  label: "Behandler",
  noBehandler: "Ingen behandler",
  behandlersokTekst: "Legg til en behandler",
  behandlerMissing: "Vennligst velg behandler",
};

export const INGEN_BEHANDLER = "INGEN_BEHANDLER";
const SOK_BEHANDLER = "SOK_BEHANDLER";

export function DialogmoteEndringBehandler() {
  const { register, watch } = useFormContext<EndreSkjemaValues>();
  const { field, fieldState } = useController<EndreSkjemaValues, "nyBehandler">(
    {
      name: "nyBehandler",
      rules: {
        validate: (value, formValues) =>
          formValues.behandlerValg === SOK_BEHANDLER && !value
            ? texts.behandlerMissing
            : true,
      },
    },
  );
  const { data: behandlere, isLoading } = useBehandlereQuery();

  function handleBehandlerValgChange(event: ChangeEvent<HTMLInputElement>) {
    field.onChange(
      behandlere.find((b) => b.behandlerRef === event.target.value),
    );
  }

  if (isLoading) {
    return <AppSpinner />;
  }

  return (
    <div>
      <RadioGroup
        legend={texts.label}
        name="behandlerValg"
        size="small"
        value={watch("behandlerValg")}
        error={fieldState.error?.message}
      >
        <Radio
          value={INGEN_BEHANDLER}
          {...register("behandlerValg", {
            onChange: handleBehandlerValgChange,
          })}
        >
          {texts.noBehandler}
        </Radio>
        {behandlere.map((behandler) => (
          <Radio
            key={behandler.behandlerRef}
            value={behandler.behandlerRef}
            {...register("behandlerValg", {
              onChange: handleBehandlerValgChange,
            })}
          >
            {behandlerDisplayText(behandler)}
          </Radio>
        ))}
        <Radio
          value={SOK_BEHANDLER}
          {...register("behandlerValg", {
            onChange: handleBehandlerValgChange,
          })}
        >
          {texts.behandlersokTekst}
        </Radio>
      </RadioGroup>
      {watch("behandlerValg") === SOK_BEHANDLER && (
        <BehandlerSearch
          setSelectedBehandler={field.onChange}
          label={texts.behandlersokTekst}
        />
      )}
    </div>
  );
}
