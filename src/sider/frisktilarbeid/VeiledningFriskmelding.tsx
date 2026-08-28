import { VeiledningBox } from "@/components/veiledning/VeiledningBox";
import { VeiledningList } from "@/components/veiledning/VeiledningList";
import { BodyShort, Box, Heading, List, VStack } from "@navikt/ds-react";
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
        "Vedtaket kan ikke innvilges for en periode bruker ikke har vært registrert som arbeidssøker. Sjekk om bruker har registrert seg som arbeidssøker. Eventuelt kan du i samråd med den sykmeldte benytte “Registrer arbeidssøker”",
    },
    fatt14aVedtak: "Fatt § 14a-vedtak i Modia arbeidsrettet oppfølging",
    sendVedtak:
      "Send vedtak om Friskmelding til arbeidsformidling, med tilpasset begrunnelse",
    sendGosysOppgave:
      "Modia sender Gosys-oppgave til Nav arbeid og ytelser automatisk i løpet av noen minutter",
  },
  infoTitle: "Tilleggsinformasjon",
  infoBulletPoints: [
    "Du trenger ikke å sjekke Infotrygd når du fatter vedtak i Modia.",
    "Av juridiske grunner skal ikke behandler få tilsendt kopi av vedtaket.",
  ],
};

function Forberedelser() {
  return (
    <Box>
      <Heading level="3" size="small" spacing>
        {texts.title}
      </Heading>

      <BodyShort size="small" className="mb-4">
        {texts.intro}
      </BodyShort>

      <VeiledningList as="ul">
        {texts.preparations.map((text, index) => (
          <List.Item key={index}>{text}</List.Item>
        ))}
      </VeiledningList>
    </Box>
  );
}

function StegForSteg() {
  return (
    <Box>
      <Heading level="3" size="small" spacing>
        {texts.rutineTitle}
      </Heading>

      <VeiledningList as="ol">
        <List.Item>
          {texts.rutineSteps.registrerSomArbeidssoker.title}
        </List.Item>
        <List.Item>{texts.rutineSteps.fatt14aVedtak}</List.Item>
        <List.Item>{texts.rutineSteps.sendVedtak}</List.Item>
        <List.Item>{texts.rutineSteps.sendGosysOppgave}</List.Item>
      </VeiledningList>
    </Box>
  );
}

function Tilleggsinformasjon() {
  return (
    <Box>
      <Heading level="4" size="xsmall" spacing>
        {texts.infoTitle}
      </Heading>

      <VeiledningList as="ul">
        {texts.infoBulletPoints.map((text, index) => (
          <List.Item key={index}>{text}</List.Item>
        ))}
      </VeiledningList>
    </Box>
  );
}

export default function VeiledningFriskmelding() {
  return (
    <VeiledningBox>
      <Forberedelser />
      <StegForSteg />
      <Tilleggsinformasjon />
    </VeiledningBox>
  );
}
