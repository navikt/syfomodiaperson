import AppSpinner from "@/components/AppSpinner";
import BehandlerSearch from "@/components/behandler/BehandlerSearch";
import { useBehandlereQuery } from "@/data/behandler/behandlereQueryHooks";
import { EndreSkjemaValues } from "@/sider/dialogmoter/types/skjemaTypes";
import { behandlerDisplayText } from "@/utils/behandlerUtils";
import { Radio, RadioGroup } from "@navikt/ds-react";
import { useState } from "react";
import { useController } from "react-hook-form";

const texts = {
  label: "Behandler",
  noBehandler: "Ingen behandler",
  behandlersokTekst: "Legg til en behandler",
  behandlerMissing: "Vennligst velg behandler",
};

const INGEN_BEHANDLER = "INGEN_BEHANDLER";
const SOK_BEHANDLER = "SOK_BEHANDLER";

export function DialogmoteEndringBehandler() {
  const [valgtRadio, setValgtRadio] = useState<string>(INGEN_BEHANDLER);
  const { field, fieldState } = useController<EndreSkjemaValues, "nyBehandler">(
    {
      name: "nyBehandler",
      rules: {
        validate: (value) =>
          valgtRadio === SOK_BEHANDLER && !value
            ? texts.behandlerMissing
            : true,
      },
    },
  );
  const { data: behandlere, isLoading } = useBehandlereQuery();

  function handleRadioChange(verdi: string) {
    setValgtRadio(verdi);
    field.onChange(behandlere.find((b) => b.behandlerRef === verdi));
  }

  if (isLoading) {
    return <AppSpinner />;
  }

  return (
    <div>
      <RadioGroup
        legend={texts.label}
        size="small"
        value={valgtRadio}
        onChange={handleRadioChange}
        error={fieldState.error?.message}
      >
        <Radio value={INGEN_BEHANDLER}>{texts.noBehandler}</Radio>
        {behandlere.map((behandler) => (
          <Radio key={behandler.behandlerRef} value={behandler.behandlerRef}>
            {behandlerDisplayText(behandler)}
          </Radio>
        ))}
        <Radio value={SOK_BEHANDLER}>{texts.behandlersokTekst}</Radio>
      </RadioGroup>
      {valgtRadio === SOK_BEHANDLER && (
        <BehandlerSearch
          setSelectedBehandler={field.onChange}
          label={texts.behandlersokTekst}
        />
      )}
    </div>
  );
}
