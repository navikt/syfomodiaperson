export const innkallingTexts = {
  moteTidTitle: "Møtetidspunkt",
  moteStedTitle: "Møtested",
  videoLinkTitle: "Lenke til videomøte",
  arbeidstaker: {
    intro1:
      "Velkommen til dialogmøte mellom deg, arbeidsgiveren din og en veileder fra NAV. I møtet skal vi snakke om situasjonen din og bli enige om en plan som kan hjelpe deg videre.",
    intro2:
      "I møtet vil vi høre både hva du og arbeidsgiveren sier om arbeidssituasjonen og mulighetene for å jobbe.",
    outro1:
      "Den som har sykmeldt deg, eller en annen behandler, kan også bli invitert til å delta i møtet. Til dette møtet har vi ikke sett behov for det.",
    outro2Title: "Før møtet",
    outro2Text:
      "Det er viktig at dere fyller ut oppfølgingsplanen sammen og deler den med NAV. Den gir oss et godt utgangspunkt for å snakke om hva som fungerer, hva som har blitt forsøkt, og hvilke muligheter som finnes framover.",
  },
  arbeidsgiver: {
    intro1:
      "Velkommen til dialogmøte i regi av NAV. NAV har ansvar for å innkalle til dialogmøte senest når en sykmelding har vart i seks måneder, eventuelt på et annet tidspunkt hvis noen av partene ser behov for det.",
    intro2:
      "I møtet vil vi høre både hva du og arbeidsgiveren sier om arbeidssituasjonen og mulighetene for å jobbe.",
    outro1:
      "Det er obligatorisk å delta i dialogmøtet. Hvis vårt forslag ikke passer, ber vi om at du tar kontakt. Vi minner om at det ikke må sendes sensitive personopplysninger over e-post eller SMS.",
    outro2:
      "NAV kan be fastlegen eller annet helsepersonell om å delta i møtet. Til dette møtet har vi ikke sett behov for det.",
  },
};

export const endreTidStedTexts = {
  intro1:
    "Du har tidligere blitt innkalt til et dialogmøte. Møtet skulle vært avholdt",
  intro2: "Møtet må flyttes. Dette tidspunktet og møtestedet gjelder nå:",

  moteTidTitle: "Møtetidspunkt",
  moteStedTitle: "Møtested",
  videoLinkTitle: "Lenke til videomøte",
};

export const avlysningTexts = {
  intro1: "NAV har tidligere innkalt til dialogmøtet som skulle vært avholdt",
  intro2: "Dette møtet er avlyst.",
};

export const commonTexts = {
  hilsen: "Vennlig hilsen",
  arbeidsgiverTlfLabel: "Arbeidsgivertelefonen",
  arbeidsgiverTlf: "55 55 33 36",
};

// Disse nøklene knyttes til linker i eSyfo og skal ikke endres.
export enum StandardtekstKey {
  IKKE_BEHOV = "IKKE_BEHOV",
  FRISKMELDING_ARBEIDSFORMIDLING = "FRISKMELDING_ARBEIDSFORMIDLING",
  AVKLARING_ARBEIDSEVNE = "AVKLARING_ARBEIDSEVNE",
  OPPFOLGINGSTILTAK = "OPPFOLGINGSTILTAK",
  ARBEIDSRETTET_REHABILITERING = "ARBEIDSRETTET_REHABILITERING",
  OPPLAERING_UTDANNING = "OPPLAERING_UTDANNING",
  UNNTAK_ARBEIDSGIVERPERIODE = "UNNTAK_ARBEIDSGIVERPERIODE",
  REISETILSKUDD = "REISETILSKUDD",
  HJELPEMIDLER_TILRETTELEGGING = "HJELPEMIDLER_TILRETTELEGGING",
  MIDLERTIDIG_LONNSTILSKUDD = "MIDLERTIDIG_LONNSTILSKUDD",
  OKONOMISK_STOTTE = "OKONOMISK_STOTTE",
  INGEN_RETTIGHETER = "INGEN_RETTIGHETER",
}

export interface StandardTekst {
  key: StandardtekstKey;
  label: string;
  text: string;
}

const referatStandardTekster: StandardTekst[] = [
  {
    key: StandardtekstKey.IKKE_BEHOV,
    label: "Ikke behov for bistand fra NAV nå",
    text:
      "Slik situasjonen er nå, er det ikke behov for noen spesiell bistand fra NAV. Dere kan likevel be om nytt dialogmøte når dere har behov for det.",
  },
  {
    key: StandardtekstKey.FRISKMELDING_ARBEIDSFORMIDLING,
    label: "Friskmelding til arbeidsformidling",
    text:
      "Denne ordningen er aktuell hvis helsen din er slik at du kan komme tilbake i arbeid, men ikke til den jobben du er sykmeldt fra. Hvis alle muligheter for å komme tilbake til arbeidsplassen din er forsøkt, kan du få sykepenger i inntil 12 uker mens du søker ny jobb. Maksimal periode med sykepenger er 52 uker, inkludert ukene med friskmelding til arbeidsformidling.",
  },
  {
    key: StandardtekstKey.AVKLARING_ARBEIDSEVNE,
    label: "Avklaring av arbeidsevnen",
    text:
      "Du kan få kartlagt eller prøvd ut arbeidsevnen din. Avklaringen kan skje der du jobber eller på en annen arbeidsplass. Da undersøker vi om du kan utføre jobben med noen tilpasninger, om du kan få påfyll av kompetanse, eller om det er muligheter i et annet yrke. Avklaringen varer som regel i fire uker, men kan forlenges med inntil åtte uker ved behov.",
  },
  {
    key: StandardtekstKey.OPPFOLGINGSTILTAK,
    label: "Oppfølgingstiltak",
    text:
      "Du kan få støtte eller veiledning til å finne eller beholde en jobb. Dette kan være en mentor på arbeids- eller studieplassen eller støtte fra en veileder. Du kan også få veiledning når du søker jobber, og ekstra støtte i begynnelsen av en ny jobb.",
  },
  {
    key: StandardtekstKey.ARBEIDSRETTET_REHABILITERING,
    label: "Arbeidsrettet rehabilitering",
    text:
      "Du kan få individuell veiledning om helse og livsstil og hjelp til å komme i form.  Det kan gjøre at du finner motivasjon og blir tryggere på deg selv. Slik blir mulighetene dine til å komme i jobb igjen styrket. Du vil få opplæring og får prøvd ut kontakten med arbeidslivet i trygge omgivelser.",
  },
  {
    key: StandardtekstKey.OPPLAERING_UTDANNING,
    label: "Opplæring og utdanning",
    text:
      "Har du vært lenge syk, kan kurs eller utdanning ha ekstra stor betydning for å komme i jobb igjen. Kanskje kan det være aktuelt med noen kurs (arbeidsmarkedsopplæring - AMO), opplæring på videregående nivå, fagskole eller høyere utdanning.",
  },
  {
    key: StandardtekstKey.UNNTAK_ARBEIDSGIVERPERIODE,
    label: "Unntak fra arbeidsgiverperioden - langvarig eller kronisk sykdom",
    text:
      "De første 16 dagene av sykefraværet er det arbeidsgiveren som dekker sykepengene. Har du en kronisk eller langvarig sykdom  som gjør at du har mye fravær, kan NAV dekke sykepengene også i arbeidsgiverperioden.",
  },
  {
    key: StandardtekstKey.REISETILSKUDD,
    label: "Reisetilskudd",
    text:
      "Du kan få reisetilskudd i stedet for sykepenger hvis det gjør at du kan være i arbeid helt eller delvis. Reisetilskuddet dekker nødvendige ekstra reiseutgifter til og fra jobben mens du er syk, altså transportutgifter utover det du har til vanlig.",
  },
  {
    key: StandardtekstKey.HJELPEMIDLER_TILRETTELEGGING,
    label: "Hjelpemidler og tilrettelegging",
    text:
      "Hjelpemiddelsentralene i NAV kan bidra med både veiledning og hjelpemidler på arbeidsplassen. De finner løsninger på problemer med syn, hørsel, hukommelse, konsentrasjon, lesing, skriving eller muligheter for å bruke dataløsninger. NAV-kontoret kan sette dere i kontakt med den nærmeste hjelpemiddelsentralen.",
  },
  {
    key: StandardtekstKey.MIDLERTIDIG_LONNSTILSKUDD,
    label: "Midlertidig lønnstilskudd",
    text:
      "Arbeidsgiveren din kan få et tilskudd til lønnen hvis det er fare for at du ikke kommer tilbake etter tolv måneder med full eller gradert sykmelding. Med lønnstilskudd skal du utføre vanlige oppgaver, men du trenger ikke gjøre dem med full intensitet.",
  },
  {
    key: StandardtekstKey.OKONOMISK_STOTTE,
    label: "Hjelp til å søke om annen økonomisk støtte",
    text:
      "Klarer du ikke å komme tilbake i arbeid før den siste dagen du har rett til sykepenger, trenger vi et nytt dialogmøte. Da vil vi snakke sammen om hvordan du eventuelt kan søke om annen økonomisk støtte fra NAV.",
  },
  {
    key: StandardtekstKey.INGEN_RETTIGHETER,
    label: "Ingen videre rettigheter",
    text:
      "Slik situasjonen er nå, har du ikke krav på noen utbetalinger fra NAV. Det betyr at du må gå tilbake til arbeidet eller søke ny jobb. Du er velkommen til å se etter stillinger på arbeidsplassen.nav.no",
  },
];

export const referatTexts = {
  deltakereTitle: "Deltakere i møtet",
  intro1:
    "Formålet med dialogmøtet var å oppsummere situasjonen, drøfte mulighetene for å arbeide og legge en plan for tiden framover.",
  intro2:
    "Sykdom og diagnose er underlagt taushetsplikt. Derfor er helsen din bare et tema hvis du selv velger å være åpen om den. Av hensyn til personvernet inneholder referatet uansett ikke slike opplysninger.",
  detteSkjeddeHeader: "Dette skjedde i møtet",
  konklusjonTitle: "Konklusjon",
  arbeidstakersOppgaveTitle: "Din oppgave",
  arbeidsgiversOppgaveTitle: "Arbeidsgiverens oppgave",
  navOppgaveTitle: "NAVs oppgave",
  situasjonTitle: "Situasjon og muligheter",
  standardTeksterHeader: "Dette informerte NAV om i møtet",
  standardTekster: referatStandardTekster,
};
