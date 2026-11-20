import { ReactNode, useState } from "react";
import { VirksomhetInput } from "@/sider/dialogmoter/components/innkalling/virksomhet/VirksomhetInput";
import { VirksomhetRadioGruppe } from "@/sider/dialogmoter/components/innkalling/virksomhet/VirksomhetRadioGruppe";
import { useFeatureToggles } from "@/data/unleash/unleashQueryHooks";
import { InfoCard } from "@navikt/ds-react";
import { ExclamationmarkTriangleIcon } from "@navikt/aksel-icons";

const texts = {
  chooseArbeidsgiver: "Velg arbeidsgiver",
  noArbeidsgiver: "Det er ikke registrert en virksomhet på denne personen.",
  unemployed:
    "Hvis personen er arbeidsledig, kan du kalle inn til samarbeidsmøte fra aktivitetsplanen.",
  report_error: "Hvis du mener det er feil, meld sak i Porten.",
};

interface Props {
  velgVirksomhet(virksomhetsnummer: string): void;
  defaultVirksomhet: string | undefined;
  virksomheter: string[];
  label: string;
  error: ReactNode;
}

export function VirksomhetChooser({
  velgVirksomhet,
  defaultVirksomhet,
  virksomheter,
  label,
  error,
}: Props) {
  const { toggles } = useFeatureToggles();
  const [showInput, setShowInput] = useState<boolean>(false);

  return (
    <div className="mb-8">
      <VirksomhetRadioGruppe
        defaultVirksomhet={defaultVirksomhet}
        velgVirksomhet={velgVirksomhet}
        setShowInput={setShowInput}
        virksomheter={virksomheter}
        label={label}
        error={error}
      />

      {showInput && <VirksomhetInput velgVirksomhet={velgVirksomhet} />}

      {virksomheter.length === 0 && !toggles.isVirksomhetsinputEnabled && (
        <InfoCard data-color="warning" size="small">
          <InfoCard.Header icon={<ExclamationmarkTriangleIcon aria-hidden />}>
            <InfoCard.Title>{texts.noArbeidsgiver}</InfoCard.Title>
          </InfoCard.Header>
          <InfoCard.Content>
            <ul>
              <li>{texts.unemployed}</li>
              <li>{texts.report_error}</li>
            </ul>
          </InfoCard.Content>
        </InfoCard>
      )}
    </div>
  );
}
