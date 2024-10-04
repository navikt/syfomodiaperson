import { BodyShort, Box, Heading } from "@navikt/ds-react";
import React from "react";
import { EksternLenke } from "@/components/EksternLenke";

const texts = {
  heading: "Sykmeldtes svarskjema",
  link: "Se nyeste versjon av svarskjemaet her",
  linkDesc:
    "Lenken tar deg til en øvingsside der du trygt kan klikke deg rundt i skjemaet som den sykmeldte svarer på.",
};

const demoUrl =
  "https://demo.ekstern.dev.nav.no/syk/meroppfolging/snart-slutt-pa-sykepengene";

export default function OvingssideLink() {
  return (
    <Box
      background="surface-default"
      padding="6"
      className="flex flex-col gap-4 mb-2"
    >
      <Heading level="2" size="medium">
        {texts.heading}
      </Heading>
      <div>
        <EksternLenke href={demoUrl}>{texts.link}</EksternLenke>
        <BodyShort size="small" className="my-2">
          {texts.linkDesc}
        </BodyShort>
      </div>
    </Box>
  );
}
