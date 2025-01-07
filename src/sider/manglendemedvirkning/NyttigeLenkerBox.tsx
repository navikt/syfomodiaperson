import { Box, Heading } from "@navikt/ds-react";
import React from "react";
import { EksternLenke } from "@/components/EksternLenke";

const texts = {
  heading: "Nyttige lenker",
  rundskrivLinkForsteLedd: "Rundskriv til § 8-8 første ledd",
  rundskrivLinkTredjeLedd: "Rundskriv til § 8-8 tredje ledd",
};

const rundskrivUrlForsteLedd =
  "https://lovdata.no/pro/#document/NAV/rundskriv/r08-00/KAPITTEL_3-8-2";

const rundskrivUrlTredjeLedd =
  "https://lovdata.no/pro/#document/NAV/rundskriv/r08-00/KAPITTEL_3-8-4";

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
      <EksternLenke href={rundskrivUrlForsteLedd}>
        {texts.rundskrivLinkForsteLedd}
      </EksternLenke>
      <EksternLenke href={rundskrivUrlTredjeLedd}>
        {texts.rundskrivLinkTredjeLedd}
      </EksternLenke>
    </Box>
  );
}
