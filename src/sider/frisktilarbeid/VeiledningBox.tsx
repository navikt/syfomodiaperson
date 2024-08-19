import { BodyShort, Box, Heading, List } from "@navikt/ds-react";
import React from "react";
import { EksternLenke } from "@/components/EksternLenke";

const texts = {
  title: "Forberedelser",
  intro:
    "Her er noen punkter som må være på plass før du fatter vedtak og ordningen starter:",
  preparations: [
    "Sjekk om utbetaling av sykepenger er igangsatt",
    "Vurder om bruker er frisk nok til å ta annet arbeid",
    "Bruker må være informert om ordningen og medfølgende plikter",
    "Det må foreligge sluttattest/oppsigelse fra ansettelsesforholdet",
    "Det må foreligge bekreftelse om fritak fra arbeid i oppsigelsesperioden",
  ],
  rutineTitle: "Rutine",
  rutineSteps: {
    registrerSomArbeidssoker: {
      title: "Bruker må registrere seg som arbeidssøker",
      extraInfo: [
        "Eventuelt kan du i samråd med den sykmeldte benytte Registrer arbeidssøker",
      ],
    },
    hentOppgaveArena: {
      title:
        "Hent oppgaven «Individuell oppfølging - automatisk opprettet» i Arena",
      steps: [
        "Fatt §14a-vedtak i Arena",
        "Oppdater meldestatus",
        "Sjekk om meldekort er opprettet",
        "Sjekk om bruker har status som arbeidssøker",
      ],
    },
    sendVedtak:
      "Send vedtak om Friskmelding til arbeidsformidling i Modia syfo",
    sendGosysOppgave: "Send Gosys-oppgave til NAY",
  },
  infoTitle: "Tilleggsinformasjon",
  infoBulletPoints: [
    "Du trenger ikke å sjekke Infotrygd når du fatter vedtak i Modia.",
    "Av juridiske grunner skal ikke behandler få tilsendt kopi av vedtaket.",
  ],
  link: "Servicerutinen på Navet",
};

const serviceRutineLink =
  "https://navno.sharepoint.com/sites/fag-og-ytelser-regelverk-og-rutiner/SitePages/Sykefrav%C3%A6rsomr%C3%A5det-Virkemidler.aspx";

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
        <List as="ul" size="small">
          <List.Item>
            {texts.rutineSteps.registrerSomArbeidssoker.extraInfo}
          </List.Item>
        </List>
        <List.Item>{texts.rutineSteps.hentOppgaveArena.title}</List.Item>
        <List as="ul" size="small">
          {texts.rutineSteps.hentOppgaveArena.steps.map((text, index) => (
            <List.Item key={index}>{text}</List.Item>
          ))}
        </List>
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

export function VeiledningBox() {
  return (
    <Box background="surface-default" padding="6">
      <Forberedelser />
      <StegForSteg />
      <Tilleggsinformasjon />
      <EksternLenke href={serviceRutineLink} className="mt-2">
        {texts.link}
      </EksternLenke>
    </Box>
  );
}
