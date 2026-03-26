import { GlobalAlert } from "@navikt/ds-react";
import React from "react";

const texts = {
  title:
    "Grunnet nye tilgangsordninger i Modia/Syfo vil tilgangen din snart stenges.",
  description:
    "For å beholde tilgangen må du be din leder om å gi deg en av tilgangene MODIA-SYFO-VEILEDER eller MODIA-SYFO-LESETILGANG i Mine Tilganger.",
};

export default function LegacyTilgangBanner() {
  return (
    <GlobalAlert status="warning">
      <GlobalAlert.Header>
        <GlobalAlert.Title className="text-base">
          {texts.title}
        </GlobalAlert.Title>
      </GlobalAlert.Header>
      <GlobalAlert.Content>{texts.description}</GlobalAlert.Content>
    </GlobalAlert>
  );
}
