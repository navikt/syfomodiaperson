import React, { ReactElement } from "react";
import { BodyShort, Box, Heading, List } from "@navikt/ds-react";
import { FattVedtakSkjema } from "@/sider/frisktilarbeid/FattVedtakSkjema";

const texts = {
  title: "Forberedelser",
  intro:
    "Her er noen punkter som må være på plass før du fatter vedtak og ordningen starter:",
  preparations: [
    "Forsikre deg om at utbetaling av sykepenger er igangsatt",
    "Er bruker frisk nok til å bytte arbeid?",
    "Bruker må være informert om ordningen og medfølgende plikter",
    "Har du fått bekreftelse på oppsigelse?",
    "Har du fått bekreftelse på unntak fra arbeidsplikt i oppsigelsesperioden",
    "Du må fatte et § 14a-vedtak i Arena",
  ],
  infoTitle: "Tilleggsinformasjon",
  infoBulletPoints: [
    "Du trenger ikke å sjekke Infotrygd når du fatter vedtak i Modia.",
    "Av juridiske grunner skal ikke behandler få tilsendt kopi av vedtaket.",
  ],
  button: "Vurder vedtak",
};

export const FattNyttVedtak = (): ReactElement => {
  return (
    <div className="flex flex-col [&>*]:mb-4">
      <Box background="surface-default" padding="6">
        <Heading level="3" size="small">
          {texts.title}
        </Heading>
        <BodyShort size="small">{texts.intro}</BodyShort>
        <List as="ul" size="small">
          {texts.preparations.map((text, index) => (
            <List.Item key={index}>{text}</List.Item>
          ))}
        </List>
        <Heading level="4" size="xsmall">
          {texts.infoTitle}
        </Heading>
        <List as="ul" size="small">
          {texts.infoBulletPoints.map((text, index) => (
            <List.Item key={index}>{text}</List.Item>
          ))}
        </List>
      </Box>
      <FattVedtakSkjema />
    </div>
  );
};
