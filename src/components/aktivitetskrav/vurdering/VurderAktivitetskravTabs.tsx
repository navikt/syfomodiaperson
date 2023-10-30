import React from "react";
import { useFeatureToggles } from "@/data/unleash/unleashQueryHooks";
import { usePersonoppgaverQuery } from "@/data/personoppgave/personoppgaveQueryHooks";
import { hasUbehandletPersonoppgave } from "@/utils/personOppgaveUtils";
import { PersonOppgaveType } from "@/data/personoppgave/types/PersonOppgave";
import { AktivitetskravDTO } from "@/data/aktivitetskrav/aktivitetskravTypes";
import { Tabs } from "@navikt/ds-react";
import { UnntakAktivitetskravSkjema } from "@/components/aktivitetskrav/vurdering/UnntakAktivitetskravSkjema";
import { OppfyltAktivitetskravSkjema } from "@/components/aktivitetskrav/vurdering/OppfyltAktivitetskravSkjema";
import { SendForhandsvarselSkjema } from "@/components/aktivitetskrav/vurdering/SendForhandsvarselSkjema";
import { IkkeOppfyltAktivitetskravSkjema } from "@/components/aktivitetskrav/vurdering/IkkeOppfyltAktivitetskravSkjema";

const texts = {
  unntak: "Sett unntak",
  oppfylt: "Er i aktivitet",
  forhandsvarsel: "Send forhåndsvarsel",
  ikkeOppfylt: "Ikke oppfylt",
};

enum TabValue {
  UNNTAK = "UNNTAK",
  OPPFYLT = "OPPFYLT",
  FORHANDSVARSEL = "FORHANDSVARSEL",
  IKKE_OPPFYLT = "IKKE_OPPFYLT",
}

interface VurderAktivitetskravTabsProps {
  aktivitetskrav: AktivitetskravDTO | undefined;
}

export const VurderAktivitetskravTabs = ({
  aktivitetskrav,
}: VurderAktivitetskravTabsProps) => {
  const { toggles } = useFeatureToggles();
  const { data: oppgaver } = usePersonoppgaverQuery();
  const hasUbehandletVurderStansOppgave = hasUbehandletPersonoppgave(
    oppgaver,
    PersonOppgaveType.AKTIVITETSKRAV_VURDER_STANS
  );
  const isIkkeOppfyltTabVisible =
    hasUbehandletVurderStansOppgave ||
    !toggles.isSendingAvForhandsvarselEnabled;

  const aktivitetskravUuid = aktivitetskrav?.uuid;

  return (
    <Tabs defaultValue={TabValue.UNNTAK} className={"mt-4 w-max"}>
      <Tabs.List>
        <Tabs.Tab value={TabValue.UNNTAK} label={texts.unntak} />
        <Tabs.Tab value={TabValue.OPPFYLT} label={texts.oppfylt} />
        {aktivitetskrav && toggles.isSendingAvForhandsvarselEnabled && (
          <Tabs.Tab
            value={TabValue.FORHANDSVARSEL}
            label={texts.forhandsvarsel}
          />
        )}
        {isIkkeOppfyltTabVisible && (
          <Tabs.Tab value={TabValue.IKKE_OPPFYLT} label={texts.ikkeOppfylt} />
        )}
      </Tabs.List>
      <Tabs.Panel value={TabValue.UNNTAK}>
        <UnntakAktivitetskravSkjema aktivitetskravUuid={aktivitetskravUuid} />
      </Tabs.Panel>
      <Tabs.Panel value={TabValue.OPPFYLT}>
        <OppfyltAktivitetskravSkjema aktivitetskravUuid={aktivitetskravUuid} />
      </Tabs.Panel>
      <Tabs.Panel value={TabValue.FORHANDSVARSEL}>
        <SendForhandsvarselSkjema aktivitetskravUuid={aktivitetskravUuid} />
      </Tabs.Panel>
      <Tabs.Panel value={TabValue.IKKE_OPPFYLT}>
        <IkkeOppfyltAktivitetskravSkjema
          aktivitetskravUuid={aktivitetskravUuid}
        />
      </Tabs.Panel>
    </Tabs>
  );
};
