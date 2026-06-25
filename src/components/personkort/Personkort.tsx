import React, { useState } from "react";
import { PERSONKORTVISNING_TYPE } from "@/konstanter";
import { PersonkortVisning } from "./PersonkortVisning";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import { PersonkortHeader } from "@/components/personkort/PersonkortHeader/PersonkortHeader";
import { ExpansionCard, Tabs } from "@navikt/ds-react";

const texts = {
  buttons: {
    sykmeldt: "Kontaktinformasjon",
    leder: "Nærmeste leder",
    fastlege: "Fastlege",
    enhet: "Behandlende enhet",
    sikkerhetstiltak: "Sikkerhetstiltak",
  },
};

export function Personkort() {
  const [visning, setVisning] = useState(PERSONKORTVISNING_TYPE.SYKMELDT);
  const { hasSikkerhetstiltak } = useNavBrukerData();

  return (
    <ExpansionCard size="small" aria-label="Personkort" className="mb-2">
      <ExpansionCard.Header className="[&>div]:w-full">
        <ExpansionCard.Title size="small" className="flex">
          <PersonkortHeader />
        </ExpansionCard.Title>
      </ExpansionCard.Header>
      <ExpansionCard.Content>
        <Tabs
          value={visning}
          size="small"
          onChange={(value) => setVisning(value)}
        >
          <Tabs.List>
            <Tabs.Tab
              value={PERSONKORTVISNING_TYPE.SYKMELDT}
              label={texts.buttons.sykmeldt}
            />
            <Tabs.Tab
              value={PERSONKORTVISNING_TYPE.LEDER}
              label={texts.buttons.leder}
            />
            <Tabs.Tab
              value={PERSONKORTVISNING_TYPE.LEGE}
              label={texts.buttons.fastlege}
            />
            <Tabs.Tab
              value={PERSONKORTVISNING_TYPE.ENHET}
              label={texts.buttons.enhet}
            />
            {hasSikkerhetstiltak && (
              <Tabs.Tab
                value={PERSONKORTVISNING_TYPE.SIKKERHETSTILTAK}
                label={texts.buttons.sikkerhetstiltak}
              />
            )}
          </Tabs.List>
          <Tabs.Panel value={visning} className="mt-4">
            <PersonkortVisning visning={visning} />
          </Tabs.Panel>
        </Tabs>
      </ExpansionCard.Content>
    </ExpansionCard>
  );
}
