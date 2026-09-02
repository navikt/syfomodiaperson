import { Periode } from "@/data/utenlandsopphold/utenlandsoppholdTypes.ts";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils.ts";

export type UtenlandsoppholdDocumentTextsValues = {
  soknadDato: Date;
};

export type InnvilgetDocumentTextsValues =
  UtenlandsoppholdDocumentTextsValues & {
    innvilgedePerioder: Periode[];
    medForbeholdOvrigeVilkar: boolean;
  };

export type AvslagDocumentTextsValues = UtenlandsoppholdDocumentTextsValues & {
  avslattePerioder: Periode[];
  begrunnelse: string;
};

export type DelvisInnvilgetDocumentTextsValues =
  UtenlandsoppholdDocumentTextsValues & {
    innvilgedePerioder: Periode[];
    avslattePerioder: Periode[];
    begrunnelse: string;
    medForbeholdOvrigeVilkar: boolean;
  };

export type HenleggelseDocumentTextsValues =
  UtenlandsoppholdDocumentTextsValues & {
    soktePerioder: Periode[];
    begrunnelse: string;
  };

export const DEFAULT_HENLEGGELSE_BEGRUNNELSE =
  "I henvendelse til NAV har du gitt beskjed om at du ønsker å trekke søknaden.";

function perioderTilTekst(perioder: Periode[]) {
  return perioder
    .map(
      (periode) =>
        `${tilLesbarDatoMedArUtenManedNavn(
          periode.fom,
        )} til og med ${tilLesbarDatoMedArUtenManedNavn(periode.tom)}`,
    )
    .join(", og ");
}

const forbeholdOvrigeVilkarText =
  "Dette vedtaket gjelder kun retten til å beholde ytelsen sykepenger under utenlandsoppholdet, dersom du får innvilget sykepenger.";
/**
 * Tekster som er identiske uavhengig av utfallet på vedtaket.
 */
export const getFellesTekster = () => ({
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
});

export const getInnvilgetTexts = ({
  soknadDato,
  innvilgedePerioder,
  medForbeholdOvrigeVilkar,
}: InnvilgetDocumentTextsValues) => {
  const soknadDatoTekst = tilLesbarDatoMedArUtenManedNavn(soknadDato);
  const innvilgedePerioderTekst = perioderTilTekst(innvilgedePerioder);

  return {
    tittel: "Vedtak om innvilgelse av utenlandsopphold",
    innvilget: {
      header: "Du har fått godkjent sykepenger under utenlandsopphold",
      intro: `Vi viser til din søknad av ${soknadDatoTekst} om å beholde sykepengene under opphold i utlandet. Søknaden din er godkjent og du får beholde sykepengene dine ved opphold i utlandet i perioden ${innvilgedePerioderTekst}.`,
      forbehold: medForbeholdOvrigeVilkar
        ? forbeholdOvrigeVilkarText
        : undefined,
    },
    begrunnelse: {
      header: "Begrunnelse for vedtaket",
      body: "Du er for tiden sykmeldt og har søkt om å beholde sykepengene på reise utenfor EU/EØS. Som hovedregel kan du få utbetalt sykepenger under utenlandsopphold utenfor EU/EØS eller andre områder der trygdeforordningen gjelder i inntil fire uker (28 kalenderdager) i løpet av en tolvmånedersperiode.",
      body2: `Du bekrefter i søknaden at det er avklart med arbeidsgiver og sykmelder at reisen ikke vil være til hinder for planlagt aktivitet og behandling. Vi vurderer videre at oppholdet ikke vil hindre Navs kontroll og oppfølging. Du får derfor innvilget din søknad om å beholde sykepenger ved opphold i utlandet i perioden ${innvilgedePerioderTekst}.`,
      paragraf:
        "Dette vedtaket er gjort etter folketrygdloven § 8-9 tredje ledd.",
    },
    oppmerksom: {
      header: "Dette må du være oppmerksom på",
      body: `Det er viktig at du er oppmerksom på at du har fått godkjent å beholde sykepenger under utenlandsopphold i perioden ${innvilgedePerioderTekst}. Dersom du oppholder deg utenfor EU/EØS eller andre områder der trygdeforordningen gjelder lengre enn dette, kan det få betydning for din videre rett til sykepenger.\n\nVi gjør oppmerksom på at vedtaket er gjort med forbehold at øvrige vilkår for sykepenger er tilstede.`,
    },
    ...getFellesTekster(),
  };
};

export const getAvslagTexts = ({
  soknadDato,
  avslattePerioder,
}: AvslagDocumentTextsValues) => {
  const soknadDatoTekst = tilLesbarDatoMedArUtenManedNavn(soknadDato);
  const avslattePerioderTekst = perioderTilTekst(avslattePerioder);

  return {
    tittel: "Vedtak om avslag på utenlandsopphold",
    avslag: {
      header: "Du har fått avslag på sykepenger under utenlandsopphold",
      intro: `Vi viser til din søknad av ${soknadDatoTekst} om å beholde sykepengene under opphold i utlandet. Søknaden din er avslått og du får ikke utbetalt sykepengene dine ved opphold i utlandet i perioden ${avslattePerioderTekst}.`,
    },
    begrunnelse: {
      header: "Begrunnelse for vedtaket",
      body: "Du er for tiden sykmeldt og har søkt om å beholde sykepengene på reise utenfor EU/EØS. Som hovedregel kan du få utbetalt sykepenger under utenlandsopphold utenfor EU/EØS eller andre områder der trygdeforordningen gjelder i inntil fire uker (28 kalenderdager) i løpet av en tolvmånedersperiode.",
      utfall: "På bakgrunn av dette har Nav avslått søknaden din.",
      paragraf:
        "Dette vedtaket er gjort etter folketrygdloven § 8-9 tredje ledd.",
    },
    oppmerksom: {
      header: "Dette må du være oppmerksom på",
      body: "Dersom du likevel velger å reise kan dette få betydning for din videre rett til sykepenger.",
    },
    ...getFellesTekster(),
  };
};

export const getDelvisInnvilgetTexts = ({
  soknadDato,
  innvilgedePerioder,
  avslattePerioder,
  medForbeholdOvrigeVilkar,
}: DelvisInnvilgetDocumentTextsValues) => {
  const soknadDatoTekst = tilLesbarDatoMedArUtenManedNavn(soknadDato);
  const innvilgedePerioderTekst = perioderTilTekst(innvilgedePerioder);
  const avslattePerioderTekst = perioderTilTekst(avslattePerioder);

  return {
    tittel: "Vedtak om delvis innvilgelse av utenlandsopphold",
    delvisInnvilget: {
      header:
        "Du har fått godkjent deler av perioden med sykepenger under utenlandsopphold",
      intro: `Vi viser til din søknad av ${soknadDatoTekst} om å beholde sykepengene under opphold i utlandet. Søknaden din er delvis godkjent og du får beholde sykepengene dine ved opphold i utlandet i perioden ${innvilgedePerioderTekst}. Du har fått avslag på å beholde sykepengene dine i utlandet i perioden ${avslattePerioderTekst}.`,
      forbehold: medForbeholdOvrigeVilkar
        ? forbeholdOvrigeVilkarText
        : undefined,
    },
    begrunnelse: {
      header: "Begrunnelse for vedtaket",
      body: "Du er for tiden sykmeldt og har søkt om å beholde sykepengene på reise utenfor EU/EØS. Du kan få utbetalt sykepenger under utenlandsopphold utenfor EU/EØS eller andre områder der trygdeforordningen gjelder i inntil fire uker (28 kalenderdager) i løpet av en tolvmånedersperiode.",
      utfall:
        "På bakgrunn av dette har Nav innvilget deler av perioden du har søkt om.",
      paragraf:
        "Dette vedtaket er gjort etter folketrygdloven § 8-9 tredje ledd.",
    },
    oppmerksom: {
      header: "Dette må du være oppmerksom på",
      body: `Det er viktig at du er oppmerksom på at du har fått godkjent å beholde sykepenger under utenlandsopphold kun fra ${innvilgedePerioderTekst}. Dersom du oppholder deg utenfor EU/EØS eller andre områder der trygdeforordningen gjelder lengre enn dette, kan det få betydning for din videre rett til sykepenger.\n\nVi gjør oppmerksom på at vedtaket er gjort med forbehold at øvrige vilkår for sykepenger er tilstede.`,
    },
    ...getFellesTekster(),
  };
};

export const getHenleggelseTexts = ({
  soknadDato,
  soktePerioder,
  begrunnelse,
}: HenleggelseDocumentTextsValues) => {
  const soknadDatoTekst = tilLesbarDatoMedArUtenManedNavn(soknadDato);
  const soktePerioderTekst = perioderTilTekst(soktePerioder);

  return {
    tittel: "Din søknad om utenlandsopphold er trukket",
    henleggelse: {
      intro: `Vi viser til din søknad av ${soknadDatoTekst} om å beholde sykepengene under opphold i utlandet i perioden ${soktePerioderTekst}.`,
      begrunnelse,
      bekreftelse:
        "Vi bekrefter at vi har registrert søknaden din som trukket. Til orientering kommer ikke Nav til å behandle søknaden.",
      nySoknad:
        "Hvis du likevel ønsker at vi behandler søknaden din, må du søke på nytt. Dette gjør du ved å sende inn en ny søknad om å beholde sykepenger i utlandet.",
    },
  };
};
