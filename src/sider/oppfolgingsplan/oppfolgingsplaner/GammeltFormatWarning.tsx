import React from "react";
import { Link, LocalAlert } from "@navikt/ds-react";

const texts = {
  title:
    "Fra og med 1. september vises ikke lenger oppfølgingsplaner i gammelt format i Modia!",
  lenke: "Ny oppfølgingsplan ble lansert 27. april (åpner i ny fane)",
  content:
    ", og fra 31. juli var det ikke lenger mulig å sende inn oppfølgingsplan på det gamle formatet på nav.no. Fra og med 1. september vil ikke historiske oppfølgingsplaner på det gamle formatet vises i Modia SYFO, men de vil fortsatt være tilgjengelige i Gosys.",
};

const lenke =
  "https://navno.sharepoint.com/sites/fag-og-ytelser-arbeid-sykefravarsoppfolging-og-sykepenger/SitePages/Oppf%C3%B8lgingsplanen-lanseres-nasjonalt-27.-april.aspx?web=1";

export function GammeltFormatWarning() {
  return (
    <LocalAlert status="announcement" className="mb-6">
      <LocalAlert.Header>
        <LocalAlert.Title>{texts.title}</LocalAlert.Title>
      </LocalAlert.Header>
      <LocalAlert.Content>
        <Link href={lenke} inlineText target="_blank" rel="noopener noreferrer">
          {texts.lenke}
        </Link>
        {texts.content}
      </LocalAlert.Content>
    </LocalAlert>
  );
}
