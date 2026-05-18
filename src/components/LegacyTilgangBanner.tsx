import { GlobalAlert, Link } from "@navikt/ds-react";
import React from "react";

const texts = {
  title: "Du har en gammel tilgang til Modia Sykefraværsoppfølging",
  description:
    "Det er opprettet nye tilganger for Modia SYFO. Hvis du er SYFO-veileder må du få tildelt den nye tilgangen innen 1. juni 2026. Etter det vil brukere med gammel tilgang kun ha tilgang til Finn fastlege.",
};

export default function LegacyTilgangBanner() {
  return (
    <GlobalAlert status="warning">
      <GlobalAlert.Header>
        <GlobalAlert.Title className="text-base">
          {texts.title}
        </GlobalAlert.Title>
      </GlobalAlert.Header>
      <GlobalAlert.Content>
        {texts.description}{" "}
        <Link
          href="https://navno.sharepoint.com/sites/fag-og-ytelser-arbeid-sykefravarsoppfolging-og-sykepenger/SitePages/Nye-tilganger-til-Modia-sykefrav%C3%A6rsoppf%C3%B8lging.aspx"
          target="_blank"
          rel="noopener noreferrer"
        >
          Les mer på Navet
        </Link>
        .
      </GlobalAlert.Content>
    </GlobalAlert>
  );
}
