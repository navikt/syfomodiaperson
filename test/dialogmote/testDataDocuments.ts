import {
  DocumentComponentDto,
  DocumentComponentType,
} from "@/data/dialogmote/types/dialogmoteTypes";
import {
  annenDeltakerFunksjon,
  annenDeltakerNavn,
  arbeidstaker,
  behandler,
  behandlerDeltakerTekst,
  dialogmote,
  endretMote,
  lederNavn,
  mote,
  moteTekster,
  navEnhet,
  veileder,
} from "./testData";
import {
  avlysningTexts,
  commonTexts,
  endreTidStedTexts,
  innkallingTexts,
  referatTexts,
} from "@/data/dialogmote/dialogmoteTexts";
import {
  tilDatoMedManedNavnOgKlokkeslettWithComma,
  tilDatoMedUkedagOgManedNavn,
  tilDatoMedUkedagOgManedNavnOgKlokkeslett,
} from "@/utils/datoUtils";
import { genererDato } from "@/components/mote/utils";
import { capitalizeWord } from "@/utils/stringUtils";
import { behandlerNavn } from "@/utils/behandlerUtils";

const expectedArbeidstakerInnkalling: DocumentComponentDto[] = [
  {
    texts: [`Sendt ${tilDatoMedUkedagOgManedNavn(new Date())}`],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      tilDatoMedUkedagOgManedNavnOgKlokkeslett(
        genererDato(mote.datoAsISODateString, mote.klokkeslett)
      ),
    ],
    title: innkallingTexts.moteTidTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [mote.sted],
    title: innkallingTexts.moteStedTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [mote.videolink],
    title: innkallingTexts.videoLinkTitle,
    type: DocumentComponentType.LINK,
  },
  {
    texts: [`Hei ${arbeidstaker.navn}`],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [innkallingTexts.arbeidstaker.intro1],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [innkallingTexts.arbeidstaker.intro2],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [moteTekster.fritekstTilArbeidstaker],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [innkallingTexts.arbeidstaker.outro1],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [innkallingTexts.arbeidstaker.outro2Text],
    title: innkallingTexts.arbeidstaker.outro2Title,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [commonTexts.hilsen, navEnhet.navn],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [veileder.navn ?? ""],
    type: DocumentComponentType.PARAGRAPH,
  },
];

const expectedArbeidsgiverInnkalling: DocumentComponentDto[] = [
  {
    texts: [`Sendt ${tilDatoMedUkedagOgManedNavn(new Date())}`],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      tilDatoMedUkedagOgManedNavnOgKlokkeslett(
        genererDato(mote.datoAsISODateString, mote.klokkeslett)
      ),
    ],
    title: innkallingTexts.moteTidTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [mote.sted],
    title: innkallingTexts.moteStedTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [mote.videolink],
    title: innkallingTexts.videoLinkTitle,
    type: DocumentComponentType.LINK,
  },
  {
    texts: [`Gjelder ${arbeidstaker.navn}, f.nr. ${arbeidstaker.personident}`],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [innkallingTexts.arbeidsgiver.intro1],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [innkallingTexts.arbeidsgiver.intro2],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [moteTekster.fritekstTilArbeidsgiver],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [innkallingTexts.arbeidsgiver.outro1],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [innkallingTexts.arbeidsgiver.outro2],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [commonTexts.hilsen, navEnhet.navn],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [veileder.navn ?? ""],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [commonTexts.arbeidsgiverTlfLabel, commonTexts.arbeidsgiverTlf],
    type: DocumentComponentType.PARAGRAPH,
  },
];

const expectedBehandlerInnkalling: DocumentComponentDto[] = [
  {
    texts: [`Sendt ${tilDatoMedUkedagOgManedNavn(new Date())}`],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      tilDatoMedUkedagOgManedNavnOgKlokkeslett(
        genererDato(mote.datoAsISODateString, mote.klokkeslett)
      ),
    ],
    title: innkallingTexts.moteTidTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [mote.sted],
    title: innkallingTexts.moteStedTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [mote.videolink],
    title: innkallingTexts.videoLinkTitle,
    type: DocumentComponentType.LINK,
  },
  {
    texts: [`Gjelder ${arbeidstaker.navn}, f.nr. ${arbeidstaker.personident}`],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [innkallingTexts.behandler.intro1],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [innkallingTexts.behandler.intro2],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [moteTekster.fritekstTilBehandler],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [innkallingTexts.behandler.outro1],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [innkallingTexts.behandler.outro2],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [commonTexts.hilsen, navEnhet.navn],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [veileder.navn ?? ""],
    type: DocumentComponentType.PARAGRAPH,
  },
];

const expectedArbeidsgiverEndringsdokument = (
  medBehandler = false
): DocumentComponentDto[] => [
  {
    texts: [`Gjelder ${arbeidstaker.navn}, f.nr. ${arbeidstaker.personident}`],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      `${endreTidStedTexts.intro1} ${tilDatoMedManedNavnOgKlokkeslettWithComma(
        dialogmote.tid
      )}.`,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [endreTidStedTexts.intro2],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      tilDatoMedUkedagOgManedNavnOgKlokkeslett(
        genererDato(endretMote.datoAsISODateString, endretMote.klokkeslett)
      ),
    ],
    title: "Møtetidspunkt",
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [endretMote.sted],
    title: "Møtested",
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [endretMote.videolink],
    title: "Lenke til videomøte",
    type: DocumentComponentType.LINK,
  },
  {
    texts: [moteTekster.fritekstTilArbeidsgiver],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      medBehandler
        ? endreTidStedTexts.arbeidsgiver.outro1WithBehandler
        : endreTidStedTexts.arbeidsgiver.outro1,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      medBehandler
        ? `${
            endreTidStedTexts.arbeidsgiver.outro2WithBehandler
          } ${capitalizeWord(behandler.type.toLowerCase())} ${behandlerNavn(
            behandler
          )}.`
        : endreTidStedTexts.arbeidsgiver.outro2,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [endreTidStedTexts.preMeeting],
    title: endreTidStedTexts.preMeetingTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: ["Vennlig hilsen", navEnhet.navn],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [veileder.navn ?? ""],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: ["Arbeidsgivertelefonen", "55 55 33 36"],
    type: DocumentComponentType.PARAGRAPH,
  },
];

const expectedArbeidstakerEndringsdokument = (
  medBehandler = false
): DocumentComponentDto[] => [
  {
    texts: [`Hei ${arbeidstaker.navn}`],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      `${endreTidStedTexts.intro1} ${tilDatoMedManedNavnOgKlokkeslettWithComma(
        dialogmote.tid
      )}.`,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [endreTidStedTexts.intro2],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      tilDatoMedUkedagOgManedNavnOgKlokkeslett(
        genererDato(endretMote.datoAsISODateString, endretMote.klokkeslett)
      ),
    ],
    title: "Møtetidspunkt",
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [endretMote.sted],
    title: "Møtested",
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [endretMote.videolink],
    title: "Lenke til videomøte",
    type: DocumentComponentType.LINK,
  },
  {
    texts: [moteTekster.fritekstTilArbeidstaker],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      medBehandler
        ? endreTidStedTexts.arbeidstaker.outro1WithBehandler
        : endreTidStedTexts.arbeidstaker.outro1,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      medBehandler
        ? `${
            endreTidStedTexts.arbeidstaker.outro2WithBehandler
          } ${capitalizeWord(behandler.type.toLowerCase())} ${behandlerNavn(
            behandler
          )}.`
        : endreTidStedTexts.arbeidstaker.outro2,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [endreTidStedTexts.preMeeting],
    title: endreTidStedTexts.preMeetingTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: ["Vennlig hilsen", navEnhet.navn],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [veileder.navn ?? ""],
    type: DocumentComponentType.PARAGRAPH,
  },
];

const expectedBehandlerEndringsdokument: DocumentComponentDto[] = [
  {
    texts: [`Gjelder ${arbeidstaker.navn}, f.nr. ${arbeidstaker.personident}`],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      `${endreTidStedTexts.intro1} ${tilDatoMedManedNavnOgKlokkeslettWithComma(
        dialogmote.tid
      )}.`,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [endreTidStedTexts.intro2],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      tilDatoMedUkedagOgManedNavnOgKlokkeslett(
        genererDato(endretMote.datoAsISODateString, endretMote.klokkeslett)
      ),
    ],
    title: "Møtetidspunkt",
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [endretMote.sted],
    title: "Møtested",
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [endretMote.videolink],
    title: "Lenke til videomøte",
    type: DocumentComponentType.LINK,
  },
  {
    texts: [moteTekster.fritekstTilBehandler],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [endreTidStedTexts.behandler.outro1],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [endreTidStedTexts.behandler.outro2],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: ["Vennlig hilsen", navEnhet.navn],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [veileder.navn ?? ""],
    type: DocumentComponentType.PARAGRAPH,
  },
];

const expectedAvlysningArbeidsgiver: DocumentComponentDto[] = [
  {
    texts: [`Gjelder ${arbeidstaker.navn}, f.nr. ${arbeidstaker.personident}`],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      `${avlysningTexts.intro1} ${tilDatoMedManedNavnOgKlokkeslettWithComma(
        dialogmote.tid
      )}. ${avlysningTexts.intro2}`,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [moteTekster.fritekstTilArbeidsgiver],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [commonTexts.hilsen, navEnhet.navn],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [veileder.navn ?? ""],
    type: DocumentComponentType.PARAGRAPH,
  },
];

const expectedAvlysningArbeidstaker: DocumentComponentDto[] = [
  {
    texts: [`Hei ${arbeidstaker.navn}`],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      `${avlysningTexts.intro1} ${tilDatoMedManedNavnOgKlokkeslettWithComma(
        dialogmote.tid
      )}. ${avlysningTexts.intro2}`,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [moteTekster.fritekstTilArbeidstaker],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [commonTexts.hilsen, navEnhet.navn],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [veileder.navn ?? ""],
    type: DocumentComponentType.PARAGRAPH,
  },
];

const expectedAvlysningBehandler: DocumentComponentDto[] = [
  {
    texts: [`Gjelder ${arbeidstaker.navn}, f.nr. ${arbeidstaker.personident}`],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      `${avlysningTexts.intro1} ${tilDatoMedManedNavnOgKlokkeslettWithComma(
        dialogmote.tid
      )}. ${avlysningTexts.intro2}`,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [moteTekster.fritekstTilBehandler],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [commonTexts.hilsen, navEnhet.navn],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [veileder.navn ?? ""],
    type: DocumentComponentType.PARAGRAPH,
  },
];

export const expectedReferatDocument: DocumentComponentDto[] = [
  {
    texts: [arbeidstaker.navn],
    type: DocumentComponentType.HEADER,
  },
  {
    texts: [`F.nr. ${arbeidstaker.personident}`],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      `Dato: ${tilDatoMedUkedagOgManedNavn(dialogmote.tid)}`,
      `Sted: ${dialogmote.sted}`,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      `Arbeidstaker: ${arbeidstaker.navn}`,
      `Arbeidsgiver: ${lederNavn}`,
      `Fra NAV: ${veileder.navn}`,
      behandlerDeltakerTekst,
      `${annenDeltakerFunksjon}: ${annenDeltakerNavn}`,
    ],
    title: referatTexts.deltakereTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [referatTexts.intro1],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [referatTexts.intro2],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [referatTexts.detteSkjeddeHeader],
    type: DocumentComponentType.HEADER,
  },
  {
    texts: [moteTekster.konklusjonTekst],
    title: referatTexts.konklusjonTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [moteTekster.arbeidstakersOppgave],
    title: referatTexts.arbeidstakersOppgaveTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [moteTekster.arbeidsgiversOppgave],
    title: referatTexts.arbeidsgiversOppgaveTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [moteTekster.behandlersOppgave],
    title: referatTexts.behandlersOppgave,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [moteTekster.veiledersOppgave],
    title: referatTexts.navOppgaveTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [moteTekster.situasjonTekst],
    title: referatTexts.situasjonTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [commonTexts.hilsen, navEnhet.navn],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [veileder.navn || ""],
    type: DocumentComponentType.PARAGRAPH,
  },
];

export const expectedInnkallingDocuments = {
  arbeidsgiver: expectedArbeidsgiverInnkalling,
  arbeidstaker: expectedArbeidstakerInnkalling,
  behandler: expectedBehandlerInnkalling,
};

export const expectedEndringDocuments = {
  arbeidsgiver: (medBehandler = false) =>
    expectedArbeidsgiverEndringsdokument(medBehandler),
  arbeidstaker: (medBehandler = false) =>
    expectedArbeidstakerEndringsdokument(medBehandler),
  behandler: expectedBehandlerEndringsdokument,
};

export const expectedAvlysningDocuments = {
  arbeidsgiver: expectedAvlysningArbeidsgiver,
  arbeidstaker: expectedAvlysningArbeidstaker,
  behandler: expectedAvlysningBehandler,
};
