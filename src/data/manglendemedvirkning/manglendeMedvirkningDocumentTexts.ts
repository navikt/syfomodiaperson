import { tilDatoMedManedNavn } from "@/utils/datoUtils";

export function getForhandsvarselManglendeMedvirkningTexts(frist: Date) {
  return {
    title: "Varsel om mulig stans av sykepenger",
    intro: {
      p1: "For å få sykepenger er det et vilkår at du medvirker i egen sak. Dette betyr at du blant annet har en plikt til å gi opplysninger til Nav, delta i dialogmøter og ta imot tilbud om tilrettelegging.",
      p2: `Basert på opplysningene Nav har i saken har du ikke oppfylt plikten din til å medvirke, og det er heller ikke dokumentert at du hadde en rimelig grunn til å ikke medvirke. Vi vurderer derfor å stanse sykepengene dine fra og med ${tilDatoMedManedNavn(
        frist
      )}.`,
      p3: "Vi har ikke tatt en endelig avgjørelse om å stanse dine sykepenger.",
    },
    tilbakemelding: {
      header: "Gi oss tilbakemelding",
      info: `Vi ber om tilbakemelding fra deg innen ${tilDatoMedManedNavn(
        frist
      )}. Etter denne datoen vil Nav vurdere å stanse sykepengene dine.`,
    },
    kontaktinfo: {
      header: "Kontaktinformasjon",
      info: "Kontakt oss gjerne på nav.no/skriv-til-oss eller telefon 55 55 33 33.",
    },
    lovhjemmel: {
      header: "Lovhjemmel",
      intro:
        "Krav til medvirkning i egen sak er beskrevet i folketrygdloven § 8-8 første og tredje ledd.",
      pliktInfo1:
        "«Medlemmet har plikt til å gi opplysninger til arbeidsgiveren og Arbeids- og velferdsetaten om egen funksjonsevne og bidra til at hensiktsmessige tiltak for å tilrettelegge arbeidet og utprøving av funksjonsevnen blir utredet og iverksatt, se også § 21-3. Medlemmet plikter også å medvirke ved utarbeiding og gjennomføring av oppfølgingsplaner og delta i dialogmøter som nevnt i arbeidsmiljøloven § 4-6 og folketrygdloven § 8-7 a. (…)",
      pliktInfo2:
        "Retten til sykepenger faller bort dersom medlemmet uten rimelig grunn nekter å gi opplysninger eller medvirke til utredning, eller uten rimelig grunn nekter å ta imot tilbud om behandling, rehabilitering, tilrettelegging av arbeid og arbeidsutprøving eller arbeidsrettede tiltak, se også § 21-8. Det samme gjelder dersom medlemmet uten rimelig grunn unnlater å medvirke ved utarbeiding og gjennomføring av oppfølgingsplaner, unnlater å delta i dialogmøter som nevnt i første ledd, eller unnlater å være i arbeidsrelatert aktivitet som nevnt i andre ledd.»",
    },
  };
}

export function getOppfyltManglendeMedvirkningTexts(
  forhandsvarselSendtDato: Date
) {
  return {
    title: "Du har rett til videre utbetaling av sykepenger",
    previousForhandsvarsel: `I forhåndsvarsel av ${tilDatoMedManedNavn(
      forhandsvarselSendtDato
    )} ble du informert om at Nav vurderte å stanse dine sykepenger. Vi har nå vurdert at plikten til å medvirke er oppfylt, og at du har rett til videre utbetaling av sykepenger.`,
    forAFaSykepenger:
      "For å få sykepenger er det et vilkår at du medvirker i egen sak.",
    viHarBruktLoven:
      "Vi har brukt folketrygdloven § 8-8 første og tredje ledd når vi har behandlet saken din.",
  };
}

export function getUnntakManglendeMedvirkningTexts(
  forhandsvarselSendtDato: Date
) {
  return {
    title: "Vurdering av unntak fra medvirkningsplikten",
    info: {
      p1: `I forhåndsvarsel av ${tilDatoMedManedNavn(
        forhandsvarselSendtDato
      )} ble du informert om at Nav vurderte å stanse utbetaling av sykepengene dine. Vi har nå vurdert at du har rimelig grunn til ikke å medvirke i egen sak.`,
      p2: "Du har rett til videre utbetaling av sykepenger.",
    },
    loven:
      "Vi har brukt folketrygdloven § 8-8 første og tredje ledd når vi har behandlet saken din.",
  };
}

export function getIkkeAktuellManglendeMedvirkningTexts() {
  return {
    title: "Vurdering av § 8-8 manglende medvirkning",
    intro:
      "Det er vurdert at folketrygdloven § 8-8 første og tredje ledd ikke kommer til anvendelse i dette tilfellet.",
  };
}

export function getStansTexts(varselSvarfrist: Date) {
  return {
    header: "Nav har stanset sykepengene dine",
    fom: `Nav har stanset sykepengene dine fra og med ${tilDatoMedManedNavn(
      varselSvarfrist
    )}.`,
    intro:
      "For å få sykepenger har du et selvstendig ansvar for å bidra til raskest mulig å komme tilbake i arbeid, kalt medvirkningsplikten.",
    hjemmel:
      "Vi har brukt folketrygdloven § 8-8 første og tredje ledd når vi har behandlet saken din.",
  };
}
