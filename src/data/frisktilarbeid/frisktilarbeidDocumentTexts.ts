import { tilDatoMedManedNavn } from "@/utils/datoUtils";

export type VedtakTextsValues = {
  fom: Date | undefined;
  tom: Date | undefined;
};

export const getVedtakTexts = ({ fom, tom }: VedtakTextsValues) => ({
  header: "Vedtak om friskmelding til arbeidsformidling",
  innvilget: {
    header: "Du har fått innvilget friskmelding til arbeidsformidling",
    intro:
      "Du oppfyller vilkårene for friskmelding til arbeidsformidling og kan få sykepenger fra Nav mens du ser etter ny jobb.",
    periode: `Vedtaket gjelder for perioden: ${toReadableDateOrEmpty(
      fom
    )} - ${toReadableDateOrEmpty(tom)}.`,
  },
  maksdato: `Siden din maksdato for sykepenger er beregnet til ${toReadableDateOrEmpty(
    tom
  )}, vil du ikke få sykepenger etter denne datoen.`,
  begrunnelse: {
    header: "Begrunnelse for vedtaket",
    body: "Helsen din er slik at du kan komme tilbake i arbeid, men ikke til den jobben du har vært sykmeldt fra. Nå har du selv valgt å avslutte jobben, og benytte deg av ordningen friskmelding til arbeidsformidling. Dette vedtaket er gjort etter folketrygdloven § 8-5.",
  },
  sykmelding: {
    header: "Sykmelding fra legen",
    body: "Nav har ikke delt informasjonen om vedtaket med legen din. Du trenger ikke sykmelding i perioden vedtaket gjelder for, med mindre du blir syk underveis. Da må du ta kontakt med legen din.",
  },
  forAFaSykepenger: {
    header: "Hva du må gjøre for å få sykepenger",
    body: "For å få sykepenger gjennom friskmelding til arbeidsformidling må du være registrert som arbeidssøker hos Nav og søke om sykepenger hver 14. dag. Du kan da få sykepenger i opptil 12 uker mens du søker etter ny jobb. Du vil få beskjed fra oss når søknaden er klar til å fylles ut. Hvis du ikke lenger ønsker å motta sykepenger fra Nav, må du gi beskjed om det i søknaden.",
  },
  farNyJobb: {
    header: "Hvis du får en ny jobb underveis",
    body: "Hvis du får en ny jobb hvor du tjener like mye eller mer enn sykepengene du får fra Nav, vil du ikke ha rett på sykepenger lenger. Dette gjelder også hvis du begynner å jobbe mer enn 80 % av det du gjorde før du ble sykmeldt.",
  },
  ikkeFarNyJobb: {
    header: "Hvis du ikke finner ny jobb",
    body: "Hvis du ikke har fått jobb i løpet av perioden vedtaket gjelder for, kan det være aktuelt for deg å søke om dagpenger. Husk å sende søknaden før sykepengeperioden er slutt.",
    lesMer: "Du kan lese mer om dagpenger på: nav.no/dagpenger#arbeidsledig",
  },
  endringSituasjon: {
    header: "Hvis situasjonen din endrer seg",
    body: "Endringer i livssituasjonen din kan påvirke retten din til sykepenger. Dersom du gir mangelfulle eller feilaktige opplysninger, kan det føre til at du må betale tilbake penger.",
    lesMer: "Les mer om dette på: nav.no/endringer.",
  },
  sporsmal: {
    header: "Har du spørsmål?",
    body: "Hvis du har spørsmål, kan du kontakte oss via: nav.no/kontaktoss.",
  },
  dineRettigheter: {
    header: "Dine rettigheter",
    innsyn: {
      header: "Rett til innsyn:",
      body: "Du kan se opplysninger i saken ved å logge deg inn på nav.no. Du kan også kontakte oss på nav.no/kontaktoss eller 55 55 33 33.",
    },
    klage: {
      header: "Rett til å klage:",
      body: "Hvis du ikke er enig i vedtaket, kan du klage innen seks uker fra du mottok dette brevet.",
      lesMer: "Les mer om hvordan du klager her:",
      url: "nav.no/klagerettigheter",
      urlSykepenger: "nav.no/klage#sykepenger",
    },
  },
});

const toReadableDateOrEmpty = (date: Date | undefined) =>
  date ? tilDatoMedManedNavn(date) : "";
