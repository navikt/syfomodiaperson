import { Periode } from "@/data/utenlandsopphold/utenlandsoppholdTypes.ts";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils.ts";

export type UtenlandsoppholdDocumentTextsValues = {
  soknadDato: Date;
  perioder: Periode[];
};

export const getUtenlandsoppholdDocumentTexts = ({
  soknadDato,
  perioder,
}: UtenlandsoppholdDocumentTextsValues) => {
  const soknadDatoTekst = tilLesbarDatoMedArUtenManedNavn(soknadDato);
  const perioderTekst = perioder
    .map(
      (periode) =>
        `${tilLesbarDatoMedArUtenManedNavn(
          periode.fom,
        )} til og med ${tilLesbarDatoMedArUtenManedNavn(periode.tom)}`,
    )
    .join(", ");

  return {
    header: "Vedtak om utenlandsopphold",
    innvilget: {
      header: "Du har fått godkjent sykepenger under utenlandsopphold",
      intro: `Vi viser til din søknad av ${soknadDatoTekst} om å beholde sykepengene under opphold i utlandet. Søknaden din er godkjent og du får beholde sykepengene dine ved opphold i utlandet i perioden ${perioderTekst}.`,
    },
    begrunnelse: {
      header: "Begrunnelse for vedtaket",
      body: "Du er for tiden sykmeldt og har søkt om å beholde sykepengene på reise utenfor EU/EØS. Du kan få utbetalt sykepenger under utenlandsopphold utenfor EU/EØS eller andre områder der trygdeforordningen gjelder i inntil fire uker (28 kalenderdager) i løpet av en tolvmånedersperiode.",
      body2: `Du bekrefter i søknaden at det er avklart med arbeidsgiver og sykmelder at reisen ikke vil være til hinder for planlagt aktivitet og behandling. Vi vurderer videre at oppholdet ikke vil hindre Navs kontroll og oppfølging. Du får derfor innvilget din søknad om å beholde sykepenger ved opphold i utlandet i perioden ${perioderTekst}.`,
      paragraf:
        "Dette vedtaket er gjort etter folketrygdloven § 8-9 tredje ledd.",
    },
    oppmerksom: {
      header: "Dette må du være oppmerksom på",
      body: `Det er viktig at du er oppmerksom på at du har fått godkjent å beholde sykepenger under utenlandsopphold i perioden ${perioderTekst}. Dersom du oppholder deg utenfor EU/EØS eller andre områder der trygdeforordningen gjelder lengre enn dette, kan det få betydning for din videre rett til sykepenger.`,
    },
    endringSituasjon: {
      header: "Hvis situasjonen din endrer seg",
      body: "Endringer i situasjonen din kan påvirke retten din til sykepenger. Dersom du gir mangelfulle eller feilaktige opplysninger, kan det føre til at du må betale tilbake penger.",
      lesMer: "Les mer om dette på: nav.no/endringer.",
    },
    sporsmal: {
      header: "Har du spørsmål",
      body: "Hvis du har spørsmål kan du kontakte oss via: nav.no/kontaktoss eller telefon 55 55 33 33.",
    },
    dineRettigheter: {
      header: "Dine rettigheter",
      innsyn: {
        header: "Rett til innsyn",
        body: "Du kan se opplysninger i saken ved å logge deg inn på nav.no. Du kan også kontakte oss på nav.no/kontaktoss eller telefon 55 55 33 33.",
      },
      klage: {
        header: "Rett til å klage",
        body: "Hvis du ikke er enig i vedtaket, kan du klage innen seks uker fra du mottok dette brevet.",
        lesMer: "Les mer om hvordan du klager her:",
        url: "nav.no/klagerettigheter",
        urlSykepenger: "nav.no/klage#sykepenger",
      },
    },
  };
};
