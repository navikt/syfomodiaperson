import { tilDatoMedManedNavn } from "@/utils/datoUtils";

export function getForhandsvarselManglendeMedvirkningTexts(frist: Date) {
  return {
    title: "Varsel om mulig stans av sykepenger",
    intro: {
      p1: "For å få sykepenger er det et vilkår at du medvirker i egen sak. Dette betyr at du blant annet har en plikt til å gi opplysninger til NAV, delta i dialogmøter og ta imot tilbud om tilrettelegging.",
      p2: `Basert på opplysningene NAV har i saken har du ikke oppfylt plikten din til å medvirke, og det er heller ikke dokumentert at du hadde en rimelig grunn til å ikke medvirke. Vi vurderer derfor å stanse sykepengene dine fra og med ${tilDatoMedManedNavn(
        frist
      )}.`,
      p3: "Vi har ikke tatt en endelig avgjørelse om å stanse dine sykepenger.",
    },
    tilbakemelding: {
      header: "Gi oss tilbakemelding",
      info: `Vi ber om tilbakemelding fra deg innen ${tilDatoMedManedNavn(
        frist
      )}. Etter denne datoen vil NAV vurdere å stanse sykepengene dine.`,
    },
    kontaktinfo: {
      header: "Kontaktinformasjon",
      info: "Kontakt oss gjerne på nav.no/skriv-til-oss eller telefon 55 55 33 33.",
    },
    lovhjemmel: {
      header: "Lovhjemmel",
      intro:
        "Krav til medvirkning i egen sak er beskrevet i folketrygdloven § 8-8 første ledd og tredje ledd.",
      pliktInfo1:
        "«Medlemmet har plikt til å gi opplysninger til arbeidsgiveren og Arbeids- og velferdsetaten om egen funksjonsevne og bidra til at hensiktsmessige tiltak for å tilrettelegge arbeidet og utprøving av funksjonsevnen blir utredet og iverksatt, se også § 21-3. Medlemmet plikter også å medvirke ved utarbeiding og gjennomføring av oppfølgingsplaner og delta i dialogmøter som nevnt i arbeidsmiljøloven § 4-6 og folketrygdloven § 8-7 a. (…)",
      pliktInfo2:
        "Retten til sykepenger faller bort dersom medlemmet uten rimelig grunn nekter å gi opplysninger eller medvirke til utredning, eller uten rimelig grunn nekter å ta imot tilbud om behandling, rehabilitering, tilrettelegging av arbeid og arbeidsutprøving eller arbeidsrettede tiltak, se også § 21-8. Det samme gjelder dersom medlemmet uten rimelig grunn unnlater å medvirke ved utarbeiding og gjennomføring av oppfølgingsplaner, unnlater å delta i dialogmøter som nevnt i første ledd, eller unnlater å være i arbeidsrelatert aktivitet som nevnt i andre ledd.»",
    },
  };
}
