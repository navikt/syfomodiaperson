import { Button } from "@navikt/ds-react";
import React from "react";

const texts = {
  previewKnapp: "Forhåndsvisning",
};

interface Props {
  onClick: (boolean) => void;
}

export function PreviewButton({ onClick }: Props) {
  const displayPreview = () => onClick(true);

  return (
    <Button variant="secondary" type="button" onClick={displayPreview}>
      {texts.previewKnapp}
    </Button>
  );
}
