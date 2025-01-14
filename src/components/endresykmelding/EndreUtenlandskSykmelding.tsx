import React from "react";
import { erDev } from "@/utils/miljoUtil";
import { BodyShort, Box, Heading } from "@navikt/ds-react";

const texts = {
  title: "Feilregistrerte opplysninger?",
  content:
    "Har du oppdaget feilregistrerte opplysninger fra den utenlandske sykmeldingen kan du endre det her.",
  buttonLabel: "Korriger sykmeldingen",
};

const EndreUtenlandskSykmelding = () => {
  const env = erDev() ? "intern.dev" : "intern";
  const sykmeldingId = window.location.pathname.split("/")[3];
  const smregistrering = `https://syk-dig.${env}.nav.no/sykmelding/${sykmeldingId}`;

  return (
    <Box background="surface-default" padding="4" className="mb-4">
      <Heading size="medium" className="mb-2">
        {texts.title}
      </Heading>
      <BodyShort size="small" className="mb-8">
        {texts.content}
      </BodyShort>
      <a href={smregistrering} className="knapp">
        {texts.buttonLabel}
      </a>
    </Box>
  );
};

export default EndreUtenlandskSykmelding;
