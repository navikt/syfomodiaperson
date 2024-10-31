import { tilDatoMedManedNavn } from "../../utils/datoUtils";

export enum Brevmal {
  MED_ARBEIDSGIVER = "MED_ARBEIDSGIVER",
  UTEN_ARBEIDSGIVER = "UTEN_ARBEIDSGIVER",
  UTLAND = "UTLAND",
}

type ForhandsvarselTextsOptions = {
  mal: Brevmal;
  frist: Date;
};

export const getForhandsvarselTexts = ({
  frist,
  mal,
}: ForhandsvarselTextsOptions) => ({
  varselInfo: {
    header: "Varsel om mulig stans av sykepenger",
    intro: introText(mal),
    stans1: `Basert på opplysningene Nav har i saken er du ikke i arbeidsrelatert aktivitet, og det er heller ikke dokumentert at du oppfyller vilkårene for unntak fra aktivitetsplikten. Vi vurderer derfor å stanse sykepengene dine fra og med ${tilDatoMedManedNavn(
      frist
    )}.`,
    stans2:
      "Vi har ikke tatt en endelig avgjørelse om å stanse dine sykepenger.",
  },
  unngaStansInfo: {
    header: "Du kan unngå stans av sykepenger",
    tiltak1:
      "Tilbake i arbeid: Kommer du helt eller delvis tilbake i arbeid, oppfyller du aktivitetsplikten og kan fortsatt få sykepenger. Aktivitet kan dokumenteres med gradert sykmelding eller i søknaden om sykepenger.",
    tiltak2:
      "Arbeidsrettet tiltak: Aktivitetsplikten vil også være oppfylt hvis du deltar i et arbeidsrettet tiltak i regi av Nav. Ta kontakt med Nav hvis du tenker at dette er aktuelt for deg.",
    tiltak3: tiltak3Text(mal),
  },
  giOssTilbakemelding: {
    header: "Gi oss tilbakemelding",
    tilbakemeldingWithFristDate: tilbakemeldingText(mal, frist),
  },
  kontaktOss: {
    header: "Kontaktinformasjon",
    kontaktOss: kontaktOssText(mal),
  },
  lovhjemmel: {
    header: "Lovhjemmel",
    aktivitetsplikten:
      "Aktivitetsplikten er beskrevet i folketrygdloven § 8-8 andre ledd.",
    pliktInfo:
      "«Medlemmet har plikt til å være i arbeidsrelatert aktivitet, jf. § 8-7 a første ledd og arbeidsmiljøloven § 4-6 første ledd," +
      " så tidlig som mulig, og senest innen 8 uker. Dette gjelder ikke når medisinske grunner klart er til hinder for slik aktivitet," +
      " eller arbeidsrelaterte aktiviteter ikke kan gjennomføres på arbeidsplassen.»",
  },
  utland: {
    dokumentasjon:
      "Legen må bruke blokkbokstaver eller skrive på maskin. Sender du medisinsk dokumentasjon på et annet språk enn norsk eller engelsk, vil vi bruke mer tid på saksbehandlingen fordi vi må oversette dokumentene. Dersom du velger å få dokumenter oversatt før de sendes oss må du legge ved original dokumentasjon.",
  },
});

const tiltak3Text = (mal: Brevmal): string => {
  switch (mal) {
    case Brevmal.MED_ARBEIDSGIVER:
    case Brevmal.UTLAND:
      return "Unntak fra aktivitetsplikten: Du kan få unntak fra aktivitetsplikten dersom arbeidsgiveren din gir en skriftlig begrunnelse for hvorfor det ikke er mulig å legge til rette for at du kan jobbe, eller dersom din lege dokumenterer at medisinske grunner klart er til hinder for arbeidsrelatert aktivitet.";
    case Brevmal.UTEN_ARBEIDSGIVER:
      return "Unntak fra aktivitetsplikten: Du kan få unntak fra aktivitetsplikten dersom din lege dokumenterer at medisinske grunner klart er til hinder for arbeidsrelatert aktivitet.";
  }
};

const kontaktOssText = (mal: Brevmal): string => {
  switch (mal) {
    case Brevmal.MED_ARBEIDSGIVER:
    case Brevmal.UTEN_ARBEIDSGIVER:
      return "Kontakt oss gjerne på nav.no/skriv-til-oss eller telefon 55 55 33 33.";
    case Brevmal.UTLAND:
      return "Kontakt oss gjerne på nav.no/skriv-til-oss eller telefon 21 07 37 00.";
  }
};

const introText = (mal: Brevmal): string => {
  switch (mal) {
    case Brevmal.MED_ARBEIDSGIVER:
    case Brevmal.UTEN_ARBEIDSGIVER:
      return "Du har nå vært sykmeldt i over åtte uker. Du har da plikt til å være i arbeidsrelatert aktivitet.";
    case Brevmal.UTLAND:
      return "Du har nå vært sykmeldt i over åtte uker. Du har da plikt til å være i arbeidsrelatert aktivitet. Vi gjør oppmerksom på at det er vanlig praksis i Norge å være sykmeldt gradert mens man jobber gradert. Det er også vanlig praksis å kombinere jobb, eventuelt gradert jobb, med behandling.";
  }
};

const tilbakemeldingText = (mal: Brevmal, frist: Date): string => {
  switch (mal) {
    case Brevmal.MED_ARBEIDSGIVER:
    case Brevmal.UTLAND:
      return `Vi ber om tilbakemelding fra deg, arbeidsgiveren din eller den som har sykmeldt deg innen ${tilDatoMedManedNavn(
        frist
      )}. Etter denne datoen vil Nav vurdere å stanse sykepengene dine.`;
    case Brevmal.UTEN_ARBEIDSGIVER:
      return `Vi ber om tilbakemelding fra deg eller den som har sykmeldt deg innen ${tilDatoMedManedNavn(
        frist
      )}. Etter denne datoen vil Nav vurdere å stanse sykepengene dine.`;
  }
};
