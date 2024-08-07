import { Button } from "@navikt/ds-react";
import React from "react";
import * as Amplitude from "@/utils/amplitude";
import { EventType } from "@/utils/amplitude";

const texts = {
  previewKnapp: "Forhåndsvisning",
};

interface Props {
  onClick: (boolean) => void;
}

export function PreviewButton({ onClick }: Props) {
  const displayPreview = () => {
    onClick(true);
    Amplitude.logEvent({
      type: EventType.ButtonClick,
      data: { tekst: texts.previewKnapp, url: window.location.href },
    });
  };

  return (
    <Button variant="secondary" type="button" onClick={displayPreview}>
      {texts.previewKnapp}
    </Button>
  );
}
