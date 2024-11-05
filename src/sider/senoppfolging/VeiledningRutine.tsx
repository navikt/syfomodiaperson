import { Box, Heading, List } from "@navikt/ds-react";
import React from "react";
import { EksternLenke } from "@/components/EksternLenke";

const texts = {
  heading: "Veiledning",
  vurderFolgende: "Basert på svarene kan du vurdere følgende",
  rutine: [
    "§ 14a-vedtak: Hvis den sykmeldte har svart at han eller hun trenger oppfølging, skal det gjøres et § 14a-vedtak i Arena",
    "Dialogmøte: Vurder om det burde kalles inn til et dialogmøte",
    "Kontakt bruker: Ta kontakt med den sykmeldte for å avklare behov for videre oppfølging",
    "Kontakt arbeidsgiver: Ta kontakt med arbeidsgiver for å avklare muligheter for tilrettelegging",
    "Kontakt behandler: Ta kontakt med behandler for å innhente medisinske opplysninger",
    "AAP: Vurder om den sykmeldte bør søke om AAP",
  ],
  link: "Behovsvurdering og § 14 a for sykmeldte",
};

const rutineUrl =
  "https://navno.sharepoint.com/sites/fag-og-ytelser-arbeid-sykefravarsoppfolging-og-sykepenger/SitePages/Behovsvurdering-og-sykmeldte.aspx?csf=1&web=1&e=94CQ0a&CID=72bd178d-9242-4247-a5ba-c3c758b06a99";

export function VeiledningRutine() {
  return (
    <Box
      background="surface-default"
      padding="6"
      className="flex flex-col gap-4 mb-2"
    >
      <Heading size="medium">{texts.heading}</Heading>
      <List as="ul" title={texts.vurderFolgende} size="small">
        {texts.rutine.map((text, index) => (
          <List.Item key={index}>{text}</List.Item>
        ))}
      </List>
      <EksternLenke href={rutineUrl}>{texts.link}</EksternLenke>
    </Box>
  );
}
