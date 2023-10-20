import React from "react";
import { ModalType } from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravModal";
import { Button } from "@navikt/ds-react";
import { ButtonRow, PaddingSize } from "@/components/Layout";
import { AktivitetskravDTO } from "@/data/aktivitetskrav/aktivitetskravTypes";
import { useFeatureToggles } from "@/data/unleash/unleashQueryHooks";
import { hasUbehandletPersonoppgave } from "@/utils/personOppgaveUtils";
import { PersonOppgaveType } from "@/data/personoppgave/types/PersonOppgave";
import { usePersonoppgaverQuery } from "@/data/personoppgave/personoppgaveQueryHooks";

const texts = {
  avventer: "Avventer",
  oppfylt: "Er i aktivitet",
  unntak: "Sett unntak",
  ikkeOppfylt: "Ikke oppfylt",
  ikkeAktuell: "Ikke aktuell",
  forhandsvarsel: "Send forhåndsvarsel",
};

interface VurderAktivitetskravButtonsProps {
  onButtonClick: (modalType: ModalType) => void;
  aktivitetskrav: AktivitetskravDTO | undefined;
}

export const VurderAktivitetskravButtons = ({
  onButtonClick,
  aktivitetskrav,
}: VurderAktivitetskravButtonsProps) => {
  const { toggles } = useFeatureToggles();
  const { data: oppgaver } = usePersonoppgaverQuery();
  const hasUbehandletVurderStansOppgave = hasUbehandletPersonoppgave(
    oppgaver,
    PersonOppgaveType.AKTIVITETSKRAV_VURDER_STANS
  );

  return (
    <ButtonRow topPadding={PaddingSize.MD}>
      <Button variant="secondary" onClick={() => onButtonClick("AVVENT")}>
        {texts.avventer}
      </Button>
      <Button variant="secondary" onClick={() => onButtonClick("UNNTAK")}>
        {texts.unntak}
      </Button>
      <Button variant="secondary" onClick={() => onButtonClick("OPPFYLT")}>
        {texts.oppfylt}
      </Button>
      {aktivitetskrav && toggles.isSendingAvForhandsvarselEnabled && (
        <Button
          variant="secondary"
          onClick={() => onButtonClick("FORHANDSVARSEL")}
        >
          {texts.forhandsvarsel}
        </Button>
      )}
      {hasUbehandletVurderStansOppgave &&
        toggles.isSendingAvForhandsvarselEnabled && (
          <Button
            variant="secondary"
            onClick={() => onButtonClick("IKKE_OPPFYLT")}
          >
            {texts.ikkeOppfylt}
          </Button>
        )}
      <Button
        variant="secondary-neutral"
        onClick={() => onButtonClick("IKKE_AKTUELL")}
      >
        {texts.ikkeAktuell}
      </Button>
    </ButtonRow>
  );
};
