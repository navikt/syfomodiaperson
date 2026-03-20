import { Alert, BodyShort } from "@navikt/ds-react";
import React from "react";

const texts = {
  title:
    "Din tilgang til Modia er basert på en eldre tilgangsordning som snart vil bli avviklet.",
  description: "For å beholde tilgangen må du be om tilgang til en av rollene ",
  role1: "0000-CA-MODIA-SYFO-VEILEDER",
  role2: "0000-CA-MODIA-SYFO-LESETILGANG",
  inMineTilganger: " i Mine Tilganger.",
};

export default function LegacyTilgangBanner() {
  return (
    <Alert variant="warning" className="mb-4">
      <BodyShort spacing>
        <strong>{texts.title}</strong>
      </BodyShort>
      <BodyShort>
        {texts.description}
        <strong>{texts.role1}</strong>
        {" eller "}
        <strong>{texts.role2}</strong>
        {texts.inMineTilganger}
      </BodyShort>
    </Alert>
  );
}
