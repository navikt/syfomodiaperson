import { Box, Heading } from "@navikt/ds-react";
import React from "react";
import { EksternLenke } from "@/components/EksternLenke";
import KunnskapsbankTrygdemedisinLenke from "@/components/KunnskapsbankTrygdemedisinLenke";

const texts = {
  heading: "Nyttige lenker",
  rundskrivLink: "Rundskriv til § 8-4 arbeidsuførhet",
};

const rundskrivUrl =
  "https://lovdata.no/pro/#document/NAV/rundskriv/r08-00?from=NL/lov/1997-02-28-19/%C2%A78-4";

export default function NyttigeLenkerBox() {
  return (
    <Box
      background="surface-default"
      padding="4"
      className="flex flex-col gap-4 mb-2"
    >
      <Heading level="2" size="medium">
        {texts.heading}
      </Heading>
      <EksternLenke href={rundskrivUrl}>{texts.rundskrivLink}</EksternLenke>
      <KunnskapsbankTrygdemedisinLenke />
    </Box>
  );
}
