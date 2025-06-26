import { BodyShort, Box, Heading, List } from "@navikt/ds-react";
import React from "react";

const texts = {
  title: "Forberedelser",
  intro:
    "Her er noen punkter som må være på plass før du fatter vedtak og ordningen starter:",
  preparations: [
    "Sjekk om utbetaling av sykepenger er igangsatt",
    "Vurder om bruker er frisk nok til å ta annet arbeid. Dette bør avklares i samråd med behandler",
    "Det kan ikke være overlapp mellom periode med sykmelding og periode med friskmelding til arbeidsformidling",
    "Bruker må være informert om ordningen og medfølgende plikter",
    "Bruker må registrere seg som arbeidssøker",
    "Det må foreligge sluttattest/oppsigelse fra ansettelsesforholdet",
    "Det må foreligge bekreftelse om fritak fra arbeid i oppsigelsesperioden",
  ],
  rutineTitle: "Rutine",
  rutineSteps: {
    registrerSomArbeidssoker: {
      title:
        "Sjekk om bruker har registrert seg som arbeidssøker. Eventuelt kan du i samråd med den sykmeldte benytte “Registrer arbeidssøker”",
    },
    fatt14aVedtak: "Fatt § 14a-vedtak i Modia arbeidsrettet oppfølging",
    sendVedtak:
      "Send vedtak om Friskmelding til arbeidsformidling, med tilpasset begrunnelse",
    sendGosysOppgave:
      "Modia sender Gosys-oppgave til NAY automatisk i løpet av noen minutter",
  },
  infoTitle: "Tilleggsinformasjon",
  infoBulletPoints: [
    "Du trenger ikke å sjekke Infotrygd når du fatter vedtak i Modia.",
    "Av juridiske grunner skal ikke behandler få tilsendt kopi av vedtaket.",
  ],
};

function Forberedelser() {
  return (
    <>
      <Heading level="3" size="small">
        {texts.title}
      </Heading>
      <BodyShort size="small">{texts.intro}</BodyShort>
      <List as="ul" size="small">
        {texts.preparations.map((text, index) => (
          <List.Item key={index}>{text}</List.Item>
        ))}
      </List>
    </>
  );
}

function StegForSteg() {
  return (
    <>
      <Heading level="3" size="small">
        {texts.rutineTitle}
      </Heading>
      <List as="ol" size="small">
        <List.Item>
          {texts.rutineSteps.registrerSomArbeidssoker.title}
        </List.Item>
        <List.Item>{texts.rutineSteps.fatt14aVedtak}</List.Item>
        <List.Item>{texts.rutineSteps.sendVedtak}</List.Item>
        <List.Item>{texts.rutineSteps.sendGosysOppgave}</List.Item>
      </List>
    </>
  );
}

function Tilleggsinformasjon() {
  return (
    <>
      <Heading level="4" size="xsmall">
        {texts.infoTitle}
      </Heading>
      <List as="ul" size="small">
        {texts.infoBulletPoints.map((text, index) => (
          <List.Item key={index}>{text}</List.Item>
        ))}
      </List>
    </>
  );
}

export default function VeiledningBox() {
  return (
    <Box background="surface-default" padding="6" className="mb-2">
      <Forberedelser />
      <StegForSteg />
      <Tilleggsinformasjon />
    </Box>
  );
}
