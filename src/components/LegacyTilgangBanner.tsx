import { Events, trackEvent } from "@/utils/umami";
import { ExternalLinkIcon } from "@navikt/aksel-icons";
import { GlobalAlert, Link } from "@navikt/ds-react";
import React, { useEffect } from "react";

function logShowingBannerEvent() {
  trackEvent({
    // Fikk ikke til å bruke GLOBALALERT_VIST_EVENT, det er nok noe galt med typingen
    // i analytics-types
    name: Events.ALERT_VIST,
    properties: {
      tekst: BANNER_TITLE,
    },
  });
}

const BANNER_TITLE = "Du har en gammel tilgang til Modia Sykefraværsoppfølging";

export default function LegacyTilgangBanner() {
  useEffect(() => {
    logShowingBannerEvent();
  }, []);

  return (
    <GlobalAlert status="warning" centered={false}>
      <GlobalAlert.Header>
        <GlobalAlert.Title className="text-base">
          {BANNER_TITLE}
        </GlobalAlert.Title>
      </GlobalAlert.Header>
      <GlobalAlert.Content>
        <Link
          href="https://navno.sharepoint.com/sites/fag-og-ytelser-arbeid-sykefravarsoppfolging-og-sykepenger/SitePages/Nye-tilganger-til-Modia-sykefrav%C3%A6rsoppf%C3%B8lging.aspx"
          target="_blank"
          rel="noopener noreferrer"
        >
          Nye tilganger til Modia SYFO (Navet){" "}
          <ExternalLinkIcon
            title="a11y-title"
            fontSize="1.2rem"
            className="relative -top-0.5 pr-1"
          />
        </Link>{" "}
        SYFO-veiledere må tildeles ny tilgang innen{" "}
        <strong>1. juli 2026</strong>. Etter denne datoen vil gammel tilgang kun
        gi tilgang til Finn fastlege. Det arbeides med en midlertidig tilgang
        til Modia SYFO for utvalgte grupper, som vil være på plass før 1. juli.{" "}
      </GlobalAlert.Content>
    </GlobalAlert>
  );
}
