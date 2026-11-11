import { Accordion, BodyShort, Box, Heading, List } from "@navikt/ds-react";
import { Events, trackEvent, trackLinkKlikket } from "@/utils/umami";
import { EksternLenke } from "@/components/EksternLenke.tsx";

const LINK_RUTINE =
  "https://navno.sharepoint.com/sites/fag-og-ytelser-arbeid-sykefravarsoppfolging-og-sykepenger/SitePages/Bruk-av-kartleggingssp%C3%B8rsm%C3%A5l-i-sykefrav%C3%A6rsoppf%C3%B8lgingen.aspx";

const texts = {
  kontekst: "Kartleggingsspørsmål",
  heading: "Veiledning",
  intro:
    "Svarene skal hjelpe deg å tidlig identifisere sykmeldte med risiko for langtidsfravær eller fare for å falle ut av arbeidslivet.",
  infoTaushetsbelagt:
    "Det sykmeldte svarer om forhold på arbeidsplassen er taushetsbelagt informasjon og skal ikke deles med arbeidsgiver.",
  rutine: {
    vurderRisiko: "Vurder om svarene indikerer risiko for langtidsfravær",
    vurderKontakt:
      "Vurder behovet for kontakt med Nav der det indikeres risiko",
    behovForOppfolging:
      "Vurder hvordan du skal følge opp saken dersom det er behov for oppfølging fra Nav",
    info: "Vurderingen av svarene skal gjøres basert på ",
    linkText: "rutine for bruk av kartleggingsspørsmålene",
  },
  ikkeRisiko: {
    heading: "Svar fra sykmeldte som ikke indikerer risiko",
    info1:
      "Når svarene fra den sykmeldte ikke indikerer risiko for langvarig sykefravær, skal saken som hovedregel ikke følges opp videre på dette tidspunktet.",
    info2:
      "Se kun over opplysningene som allerede ligger tilgjengelig på siden for vurderingen. Dersom det ikke foreligger andre opplysninger eller henvendelser som tilsier behov for oppfølging, er det normalt ikke nødvendig å gjennomføre ytterligere kartlegging eller innhente flere opplysninger.",
    info3:
      "Dersom Nav allerede har mottatt informasjon som tilsier at den sykmeldte likevel kan ha behov for oppfølging, må du vurdere om saken skal følges opp på dette tidspunktet. Behov for oppfølging kan også avdekkes senere gjennom oppfølgingspunkter eller henvendelser fra aktørene i sykefraværet.",
    conclusion: "Oppgaven kan avsluttes uten videre behandling.",
  },
  risiko: {
    heading: "Svar fra sykmeldte som indikerer risiko",
    info1:
      "Se på svarene sammen med andre tilgjengelige opplysninger om situasjonen til den sykmeldte.",
    info2:
      "Du skal som utgangspunkt gjøre den første vurderingen på grunnlag av svarene fra den sykmeldte og opplysninger som allerede finnes i saken.",
    conclusion:
      "Vurder ut fra de samlede opplysningene om det er behov for å forstå situasjonen bedre, eller om det ikke er behov for oppfølging fra Nav på nåværende tidspunkt.",
  },
  ikkeBehov: {
    heading: "Der det ikke er behov for oppfølging fra Nav",
    info: "Svarene viser risiko for at sykefraværet kan bli langvarig, men samlet med andre opplysninger, vurderes det ikke som nødvendig med oppfølging eller veiledning fra Nav på nåværende tidspunkt. Dette kan være fordi den sykmeldte har gode muligheter for å komme tilbake i arbeid, eller fordi helsesituasjonen gjør at oppfølging fra Nav ikke er aktuelt nå.",
    conclusion:
      "Begrunn helt kort hvorfor det ikke er behov for å se nærmere på saken nå, og avslutt oppgaven.",
  },
  forstaSituasjonen: {
    heading: "Der det er behov for å forstå situasjonen bedre",
    info1:
      "Vurder hvordan du skal følge opp saken. Dette kan innebære kontakt med den sykmeldte per telefon eller digital dialog, individuell samtale, eller dialogmøte med arbeidsgiver.",
    info2:
      "Telefonsamtale eller digital dialog kan være tilstrekkelig når enkle råd, veiledning eller avklaringer antas å være tilstrekkelig for å støtte den sykmeldte tilbake i arbeid. Dette kan også være aktuelt når du er usikker på om en planlagt individuell samtale eller et dialogmøte er nødvendig.",
    info3:
      "Når du har behov for mer helhetlig informasjon for å forstå situasjonen og oppfølgingsbehovet, bør du som hovedregel gjennomføre en individuell samtale eller et dialogmøte.",
    conclusion:
      "Innkall til individuell samtale eller dialogmøte, og planlegg videre oppfølging før du avslutter oppgaven.",
  },
};

function trackAccordionApnet(isOpen: boolean, accordionTekst: string): void {
  if (isOpen) {
    trackEvent({
      name: Events.ACCORDION_APNET,
      properties: {
        tittel: accordionTekst,
        kontekst: texts.kontekst,
      },
    });
  }
}

export function KartleggingssporsmalRutine() {
  return (
    <Box background="default" padding="space-24" className="mb-2">
      <Heading level="2" size="medium" spacing>
        {texts.heading}
      </Heading>
      <div className="flex flex-col gap-4 mb-4">
        <BodyShort size="small">{texts.intro}</BodyShort>
        <BodyShort size="small">{texts.infoTaushetsbelagt}</BodyShort>
        <BodyShort size="small">
          {texts.rutine.info}
          <EksternLenke
            href={LINK_RUTINE}
            onClick={() => trackLinkKlikket(texts.rutine.linkText, LINK_RUTINE)}
          >
            {texts.rutine.linkText}
          </EksternLenke>
        </BodyShort>
        <List as="ol">
          <List.Item>
            <BodyShort size="small">{texts.rutine.vurderRisiko}</BodyShort>
          </List.Item>
          <List.Item>
            <BodyShort size="small">{texts.rutine.vurderKontakt}</BodyShort>
          </List.Item>
          <List.Item>
            <BodyShort size="small">
              {texts.rutine.behovForOppfolging}
            </BodyShort>
          </List.Item>
        </List>
      </div>
      <Accordion size="small">
        <Accordion.Item
          onOpenChange={(isOpen) =>
            trackAccordionApnet(isOpen, texts.ikkeRisiko.heading)
          }
        >
          <Accordion.Header>{texts.ikkeRisiko.heading}</Accordion.Header>
          <Accordion.Content className="[&>div]:space-y-4">
            <BodyShort size="small">{texts.ikkeRisiko.info1}</BodyShort>
            <BodyShort size="small">{texts.ikkeRisiko.info2}</BodyShort>
            <BodyShort size="small">{texts.ikkeRisiko.info3}</BodyShort>
            <BodyShort size="small" weight="semibold">
              {texts.ikkeRisiko.conclusion}
            </BodyShort>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item
          onOpenChange={(isOpen) =>
            trackAccordionApnet(isOpen, texts.risiko.heading)
          }
        >
          <Accordion.Header>{texts.risiko.heading}</Accordion.Header>
          <Accordion.Content className="[&>div]:space-y-4">
            <BodyShort size="small">{texts.risiko.info1}</BodyShort>
            <BodyShort size="small">{texts.risiko.info2}</BodyShort>
            <BodyShort size="small" weight="semibold">
              {texts.risiko.conclusion}
            </BodyShort>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item
          onOpenChange={(isOpen) =>
            trackAccordionApnet(isOpen, texts.ikkeBehov.heading)
          }
        >
          <Accordion.Header>{texts.ikkeBehov.heading}</Accordion.Header>
          <Accordion.Content className="[&>div]:space-y-4">
            <BodyShort size="small">{texts.ikkeBehov.info}</BodyShort>
            <BodyShort size="small" weight="semibold">
              {texts.ikkeBehov.conclusion}
            </BodyShort>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item
          onOpenChange={(isOpen) =>
            trackAccordionApnet(isOpen, texts.forstaSituasjonen.heading)
          }
        >
          <Accordion.Header>{texts.forstaSituasjonen.heading}</Accordion.Header>
          <Accordion.Content className="[&>div]:space-y-4">
            <BodyShort size="small">{texts.forstaSituasjonen.info1}</BodyShort>
            <BodyShort size="small">{texts.forstaSituasjonen.info2}</BodyShort>
            <BodyShort size="small">{texts.forstaSituasjonen.info3}</BodyShort>
            <BodyShort size="small" weight="semibold">
              {texts.forstaSituasjonen.conclusion}
            </BodyShort>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </Box>
  );
}
