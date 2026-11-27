import AppSpinner from "@/components/AppSpinner";
import BehandlerSearch from "@/components/behandler/BehandlerSearch";
import { useBehandlereQuery } from "@/data/behandler/behandlereQueryHooks";
import { EndreSkjemaValues } from "@/sider/dialogmoter/types/skjemaTypes";
import { behandlerDisplayText } from "@/utils/behandlerUtils";
import { Radio, RadioGroup } from "@navikt/ds-react";
import { useState } from "react";
import { useController } from "react-hook-form";
import { DialogmotedeltakerBehandlerDTO } from "@/sider/dialogmoter/types/dialogmoteTypes";

const texts = {
  label: "Behandler",
  noBehandler: "Ingen behandler",
  keepBehandler: "Behold {behandler}",
  behandlersokTekst: "Legg til en behandler",
  replaceBehandlerSearchText: "Søk etter ny behandler",
  behandlerMissing: "Vennligst velg behandler",
  behandlerAlreadySelected:
    "Valgt behandler er allerede innkalt til møtet. Velg en annen behandler.",
};

const INGEN_BEHANDLER = "INGEN_BEHANDLER";
const BEHOLD_BEHANDLER = "BEHOLD_BEHANDLER";
const SOK_BEHANDLER = "SOK_BEHANDLER";

interface Props {
  currentBehandler?: DialogmotedeltakerBehandlerDTO;
}

export function DialogmoteEndringBehandler({ currentBehandler }: Props) {
  const [valgtRadio, setValgtRadio] = useState<string>(
    currentBehandler ? BEHOLD_BEHANDLER : INGEN_BEHANDLER,
  );
  const { field, fieldState } = useController<EndreSkjemaValues, "nyBehandler">(
    {
      name: "nyBehandler",
      rules: {
        validate: (value) => {
          if (valgtRadio === SOK_BEHANDLER && !value) {
            return texts.behandlerMissing;
          }
          if (value && value.behandlerRef === currentBehandler?.behandlerRef) {
            return texts.behandlerAlreadySelected;
          }
          return true;
        },
      },
    },
  );
  const { data: behandlere, isLoading } = useBehandlereQuery();

  function handleRadioChange(verdi: string) {
    setValgtRadio(verdi);
    const selectedBehandler = behandlere.find(
      (behandler) => behandler.behandlerRef === verdi,
    );
    field.onChange(selectedBehandler);
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
        <Radio value={currentBehandler ? BEHOLD_BEHANDLER : INGEN_BEHANDLER}>
          {currentBehandler
            ? texts.keepBehandler.replace(
                "{behandler}",
                currentBehandler.behandlerNavn,
              )
            : texts.noBehandler}
        </Radio>
        {behandlere
          .filter(
            (behandler) =>
              behandler.behandlerRef !== currentBehandler?.behandlerRef,
          )
          .map((behandler) => (
            <Radio key={behandler.behandlerRef} value={behandler.behandlerRef}>
              {behandlerDisplayText(behandler)}
            </Radio>
          ))}
        <Radio value={SOK_BEHANDLER}>
          {currentBehandler
            ? texts.replaceBehandlerSearchText
            : texts.behandlersokTekst}
        </Radio>
      </RadioGroup>
      {valgtRadio === SOK_BEHANDLER && (
        <BehandlerSearch
          setSelectedBehandler={field.onChange}
          label={
            currentBehandler
              ? texts.replaceBehandlerSearchText
              : texts.behandlersokTekst
          }
        />
      )}
    </div>
  );
}
