import React from "react";
import { Alert } from "@navikt/ds-react";
import { getForhandsvarselFrist } from "@/utils/forhandsvarselUtils";
import { addWeeks } from "@/utils/datoUtils";

const texts = {
  infoText:
    "Fristen i brevet er automatisk flyttet fra 3 til 6 uker i forbindelse med jul og røde dager. Den 19. desember endres fristen automatisk tilbake til 3 uker.",
};

export function InfoUtsattFristJuletid() {
  return (
    getForhandsvarselFrist() > addWeeks(new Date(), 4) && (
      <Alert inline variant="info" className="my-8" size="small">
        {texts.infoText}
      </Alert>
    )
  );
}
