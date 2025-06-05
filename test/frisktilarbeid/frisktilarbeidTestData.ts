import {
  InfotrygdStatus,
  VedtakResponseDTO,
} from "@/data/frisktilarbeid/frisktilarbeidTypes";
import { VEILEDER_DEFAULT } from "@/mocks/common/mockConstants";
import { addWeeks, tilDatoMedManedNavn } from "@/utils/datoUtils";
import {
  DocumentComponentDto,
  DocumentComponentType,
} from "@/data/documentcomponent/documentComponentTypes";

export const createVedtak = (
  fom: Date,
  ferdigbehandletAt: Date | undefined = undefined
): VedtakResponseDTO => ({
  uuid: "123",
  createdAt: new Date(),
  veilederident: VEILEDER_DEFAULT.ident,
  fom,
  tom: addWeeks(fom, 12),
  begrunnelse: "begrunnelse",
  document: [],
  infotrygdStatus: InfotrygdStatus.KVITTERING_OK,
  ferdigbehandletAt: ferdigbehandletAt,
  ferdigbehandletBy: ferdigbehandletAt && VEILEDER_DEFAULT.ident,
});

type ExpectedVedtakDocumentOptions = {
  fom: Date;
  tom: Date;
  begrunnelse: string;
  tilDatoIsMaxDato: boolean;
};

export const getExpectedVedtakDocument = ({
  fom,
  tom,
  begrunnelse,
  tilDatoIsMaxDato,
}: ExpectedVedtakDocumentOptions): DocumentComponentDto[] => {
  return [
    {
      texts: ["Vedtak om friskmelding til arbeidsformidling"],
      type: DocumentComponentType.HEADER_H1,
    },
    {
      texts: ["Du har fått innvilget friskmelding til arbeidsformidling"],
      type: DocumentComponentType.HEADER_H2,
    },
    {
      texts: [
        "Du oppfyller vilkårene for friskmelding til arbeidsformidling og kan få sykepenger fra Nav mens du ser etter ny jobb.",
      ],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [
        `Vedtaket gjelder for perioden: ${tilDatoMedManedNavn(
          fom
        )} - ${tilDatoMedManedNavn(tom)}.`,
      ],
      type: DocumentComponentType.PARAGRAPH,
    },
    ...(tilDatoIsMaxDato
      ? [
          {
            texts: [
              `Siden din maksdato for sykepenger er beregnet til ${tilDatoMedManedNavn(
                tom
              )}, vil du ikke få sykepenger etter denne datoen.`,
            ],
            type: DocumentComponentType.PARAGRAPH,
          },
        ]
      : []),
    {
      texts: ["Begrunnelse for vedtaket"],
      type: DocumentComponentType.HEADER_H2,
    },
    {
      texts: [begrunnelse],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: [
        "Helsen din er slik at du kan komme tilbake i arbeid, men ikke til den jobben du har vært sykmeldt fra. Nå har du selv valgt å avslutte jobben, og benytte deg av ordningen friskmelding til arbeidsformidling. Dette vedtaket er gjort etter folketrygdloven § 8-5.",
      ],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: ["Sykmelding fra legen"],
      type: DocumentComponentType.HEADER_H2,
    },
    {
      texts: [
        "Nav har ikke delt informasjonen om vedtaket med legen din. Du trenger ikke sykmelding i perioden vedtaket gjelder for, med mindre du blir syk underveis. Da må du ta kontakt med legen din.",
      ],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: ["Hva du må gjøre for å få sykepenger"],
      type: DocumentComponentType.HEADER_H2,
    },
    {
      texts: [
        "For å få sykepenger gjennom friskmelding til arbeidsformidling må du være registrert som arbeidssøker hos Nav og søke om sykepenger hver 14. dag. Du kan da få sykepenger i opptil 12 uker mens du søker etter ny jobb. Du vil få beskjed fra oss når søknaden er klar til å fylles ut. Hvis du ikke lenger ønsker å motta sykepenger fra Nav, må du gi beskjed om det i søknaden.",
      ],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: ["Hvis du får en ny jobb underveis"],
      type: DocumentComponentType.HEADER_H2,
    },
    {
      texts: [
        "Hvis du får en ny jobb hvor du tjener like mye eller mer enn sykepengene du får fra Nav, vil du ikke ha rett på sykepenger lenger. Dette gjelder også hvis du begynner å jobbe mer enn 80 % av det du gjorde før du ble sykmeldt.",
      ],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: ["Hvis du ikke finner ny jobb"],
      type: DocumentComponentType.HEADER_H2,
    },
    {
      texts: [
        "Hvis du ikke har fått jobb i løpet av perioden vedtaket gjelder for, kan det være aktuelt for deg å søke om dagpenger. Husk å sende søknaden før sykepengeperioden er slutt.",
        "Du kan lese mer om dagpenger på: nav.no/dagpenger#arbeidsledig",
      ],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: ["Hvis situasjonen din endrer seg"],
      type: DocumentComponentType.HEADER_H2,
    },
    {
      texts: [
        "Endringer i livssituasjonen din kan påvirke retten din til sykepenger. Dersom du gir mangelfulle eller feilaktige opplysninger, kan det føre til at du må betale tilbake penger.",
      ],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: ["Les mer om dette på: nav.no/endringer."],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: ["Har du spørsmål?"],
      type: DocumentComponentType.HEADER_H2,
    },
    {
      texts: [
        "Hvis du har spørsmål, kan du kontakte oss via: nav.no/kontaktoss.",
      ],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: ["Dine rettigheter"],
      type: DocumentComponentType.HEADER_H2,
    },
    {
      texts: ["Rett til innsyn:"],
      type: DocumentComponentType.HEADER_H3,
    },
    {
      texts: [
        "Du kan se opplysninger i saken ved å logge deg inn på nav.no eller kontakte oss på nav.no/kontaktoss.",
      ],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: ["Rett til å klage:"],
      type: DocumentComponentType.HEADER_H3,
    },
    {
      texts: [
        "Hvis du ikke er enig i vedtaket, kan du klage innen seks uker fra du mottok dette brevet.",
      ],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: ["Les mer om hvordan du klager her:"],
      type: DocumentComponentType.PARAGRAPH,
    },
    {
      texts: ["nav.no/klagerettigheter", "nav.no/klage#sykepenger"],
      type: DocumentComponentType.BULLET_POINTS,
    },
    {
      texts: ["Med vennlig hilsen", VEILEDER_DEFAULT.fulltNavn(), "Nav"],
      type: DocumentComponentType.PARAGRAPH,
    },
  ];
};
