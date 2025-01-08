import { Box, Heading } from "@navikt/ds-react";
import React from "react";
import { EksternLenke } from "@/components/EksternLenke";

const texts = {
  heading: "Nyttige lenker",
  rundskrivLink: "Rundskriv til § 8-5 friskmelding til arbeidsformidling",
  servicerutineLink: "Servicerutinen på Navet",
};

const rundskrivUrl =
  "https://lovdata.no/pro/#document/NAV/rundskriv/r08-00?from=NL/lov/1997-02-28-19/§8-5";

const serviceRutineUrl =
  "https://navno.sharepoint.com/sites/fag-og-ytelser-regelverk-og-rutiner/SitePages/Sykefrav%C3%A6rsomr%C3%A5det-Virkemidler.aspx";

export default function NyttigeLenkerBox() {
  return (
    <Box
      background="surface-default"
      padding="6"
      className="flex flex-col gap-4 mb-2"
    >
      <Heading level="2" size="medium">
        {texts.heading}
      </Heading>
      <EksternLenke href={rundskrivUrl}>{texts.rundskrivLink}</EksternLenke>
      <EksternLenke href={serviceRutineUrl}>
        {texts.servicerutineLink}
      </EksternLenke>
    </Box>
  );
}
