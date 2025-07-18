import {
  annenDeltakerFunksjon,
  annenDeltakerNavn,
  arbeidstaker,
  behandler,
  dialogmote,
  endretMote,
  mote,
  moteTekster,
  narmesteLederNavn,
  veileder,
} from "./testData";
import {
  getAvlysningTexts,
  getCommonTexts,
  getEndreTidStedTexts,
  getInnkallingTexts,
  getReferatTexts,
} from "@/sider/dialogmoter/hooks/dialogmoteTexts";
import {
  tilDatoMedManedNavnOgKlokkeslettWithComma,
  tilDatoMedUkedagOgManedNavnOgKlokkeslett,
} from "@/utils/datoUtils";
import { genererDato } from "@/sider/dialogmoter/utils";
import {
  DocumentComponentDto,
  DocumentComponentType,
} from "@/data/documentcomponent/documentComponentTypes";
import { Malform } from "@/context/malform/MalformContext";
import { addBehandlerTypeAndName } from "@/hooks/dialogmote/document/useInnkallingDocument";
import { behandlerNavn } from "@/utils/behandlerUtils";

const innkallingTextsBokmal = getInnkallingTexts(Malform.BOKMAL);
const referatTextsBokmal = getReferatTexts(Malform.BOKMAL);
const commonTextsBokmal = getCommonTexts(Malform.BOKMAL);
const endreTidStedTextsBokmal = getEndreTidStedTexts(Malform.BOKMAL);
const avlysningTextsBokmal = getAvlysningTexts(Malform.BOKMAL);

const expectedArbeidstakerInnkalling = (
  medBehandler = false,
  sendtDato: Date
): DocumentComponentDto[] => [
  {
    texts: ["Innkalling til dialogmøte"],
    type: DocumentComponentType.HEADER_H1,
  },
  {
    texts: [
      tilDatoMedUkedagOgManedNavnOgKlokkeslett(
        genererDato(mote.datoAsISODateString, mote.klokkeslett)
      ),
    ],
    title: commonTextsBokmal.moteTidTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [mote.sted],
    title: commonTextsBokmal.moteStedTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [mote.videolink],
    title: commonTextsBokmal.videoLinkTitle,
    type: DocumentComponentType.LINK,
  },
  {
    texts: [commonTextsBokmal.videoMoteInfo],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [mote.arbeidsgivernavn],
    title: "Arbeidsgiver",
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [`Hei, ${arbeidstaker.navn}`],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [innkallingTextsBokmal.arbeidstaker.intro1],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      medBehandler
        ? innkallingTextsBokmal.arbeidstaker.intro2WithBehandler
        : innkallingTextsBokmal.arbeidstaker.intro2,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [moteTekster.fritekstTilArbeidstaker],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [innkallingTextsBokmal.arbeidstaker.outroObligatorisk],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      medBehandler
        ? addBehandlerTypeAndName(
            innkallingTextsBokmal.arbeidstaker.outro1WithBehandler,
            behandler
          )
        : innkallingTextsBokmal.arbeidstaker.outro1,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      medBehandler
        ? innkallingTextsBokmal.arbeidstaker.outro2WithBehandler
        : innkallingTextsBokmal.arbeidstaker.outro2,
    ],
    title: innkallingTextsBokmal.arbeidstaker.outro2Title,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      commonTextsBokmal.hilsen,
      veileder.fulltNavn(),
      "Nav",
      "---",
      `${
        commonTextsBokmal.brevSendt
      } ${tilDatoMedManedNavnOgKlokkeslettWithComma(sendtDato)}`,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
];

const expectedArbeidsgiverInnkalling = (
  medBehandler = false,
  sendtDato: Date
): DocumentComponentDto[] => [
  {
    texts: ["Innkalling til dialogmøte"],
    type: DocumentComponentType.HEADER_H1,
  },
  {
    texts: [
      tilDatoMedUkedagOgManedNavnOgKlokkeslett(
        genererDato(mote.datoAsISODateString, mote.klokkeslett)
      ),
    ],
    title: commonTextsBokmal.moteTidTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [mote.sted],
    title: commonTextsBokmal.moteStedTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [mote.videolink],
    title: commonTextsBokmal.videoLinkTitle,
    type: DocumentComponentType.LINK,
  },
  {
    texts: [commonTextsBokmal.videoMoteInfo],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [mote.arbeidsgivernavn],
    title: "Arbeidsgiver",
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [`Gjelder ${arbeidstaker.navn}, f.nr. ${arbeidstaker.personident}.`],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [innkallingTextsBokmal.arbeidsgiver.intro1],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [moteTekster.fritekstTilArbeidsgiver],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [innkallingTextsBokmal.arbeidsgiver.outroObligatorisk],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      medBehandler
        ? addBehandlerTypeAndName(
            innkallingTextsBokmal.arbeidsgiver.outro1WithBehandler,
            behandler
          )
        : innkallingTextsBokmal.arbeidsgiver.outro1,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    title: innkallingTextsBokmal.arbeidsgiver.outro2Title,
    texts: [
      medBehandler
        ? innkallingTextsBokmal.arbeidsgiver.outro2WithBehandler
        : innkallingTextsBokmal.arbeidsgiver.outro2,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      commonTextsBokmal.hilsen,
      veileder.fulltNavn(),
      "Nav",
      "---",
      `${
        commonTextsBokmal.brevSendt
      } ${tilDatoMedManedNavnOgKlokkeslettWithComma(sendtDato)}`,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      commonTextsBokmal.arbeidsgiverTlfLabel,
      commonTextsBokmal.arbeidsgiverTlf,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
];

const expectedBehandlerInnkalling = (
  sendtDato: Date
): DocumentComponentDto[] => [
  {
    texts: ["Innkalling til dialogmøte, svar ønskes"],
    type: DocumentComponentType.HEADER_H1,
  },
  {
    texts: [innkallingTextsBokmal.behandler.intro],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      tilDatoMedUkedagOgManedNavnOgKlokkeslett(
        genererDato(mote.datoAsISODateString, mote.klokkeslett)
      ),
    ],
    title: commonTextsBokmal.moteTidTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [mote.sted],
    title: commonTextsBokmal.moteStedTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [mote.videolink],
    title: commonTextsBokmal.videoLinkTitle,
    type: DocumentComponentType.LINK,
  },
  {
    texts: [commonTextsBokmal.videoMoteInfo],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [mote.arbeidsgivernavn],
    title: "Arbeidsgiver",
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [`Gjelder ${arbeidstaker.navn}, f.nr. ${arbeidstaker.personident}.`],
    type: DocumentComponentType.PARAGRAPH,
  },

  {
    texts: [moteTekster.fritekstTilBehandler],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [innkallingTextsBokmal.behandler.outro],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      commonTextsBokmal.hilsen,
      veileder.fulltNavn(),
      "Nav",
      "---",
      `${
        commonTextsBokmal.brevSendt
      } ${tilDatoMedManedNavnOgKlokkeslettWithComma(sendtDato)}`,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
];

const expectedArbeidsgiverEndringsdokument = (
  medBehandler = false,
  sendtDato: Date
): DocumentComponentDto[] => [
  {
    texts: ["Endret dialogmøte"],
    type: DocumentComponentType.HEADER_H1,
  },
  {
    texts: [`Gjelder ${arbeidstaker.navn}, f.nr. ${arbeidstaker.personident}.`],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      `${
        endreTidStedTextsBokmal.intro1
      } ${tilDatoMedManedNavnOgKlokkeslettWithComma(dialogmote.tid)}.`,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [endreTidStedTextsBokmal.intro2],
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
    texts: [commonTextsBokmal.videoMoteInfo],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [mote.arbeidsgivernavn],
    title: "Arbeidsgiver",
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [moteTekster.fritekstTilArbeidsgiver],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      medBehandler
        ? endreTidStedTextsBokmal.arbeidsgiver.outro1WithBehandler
        : endreTidStedTextsBokmal.arbeidsgiver.outro1,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [endreTidStedTextsBokmal.arbeidsgiver.outroObligatorisk],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      medBehandler
        ? `${
            endreTidStedTextsBokmal.arbeidsgiver.outro2WithBehandler
          } ${behandlerNavn(behandler)}.`
        : endreTidStedTextsBokmal.arbeidsgiver.outro2,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      medBehandler
        ? endreTidStedTextsBokmal.arbeidsgiver.outro3WithBehandler
        : endreTidStedTextsBokmal.arbeidsgiver.outro3,
    ],
    title: endreTidStedTextsBokmal.arbeidsgiver.outro3Title,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      commonTextsBokmal.hilsen,
      veileder.fulltNavn(),
      "Nav",
      "---",
      `${
        commonTextsBokmal.brevSendt
      } ${tilDatoMedManedNavnOgKlokkeslettWithComma(sendtDato)}`,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: ["Arbeidsgivertelefonen", "55 55 33 36"],
    type: DocumentComponentType.PARAGRAPH,
  },
];

const expectedArbeidstakerEndringsdokument = (
  medBehandler = false,
  sendtDato: Date
): DocumentComponentDto[] => [
  {
    texts: ["Endret dialogmøte"],
    type: DocumentComponentType.HEADER_H1,
  },
  {
    texts: [`Hei, ${arbeidstaker.navn}`],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      `${
        endreTidStedTextsBokmal.intro1
      } ${tilDatoMedManedNavnOgKlokkeslettWithComma(dialogmote.tid)}.`,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [endreTidStedTextsBokmal.intro2],
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
    texts: [commonTextsBokmal.videoMoteInfo],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [mote.arbeidsgivernavn],
    title: "Arbeidsgiver",
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [moteTekster.fritekstTilArbeidstaker],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      medBehandler
        ? endreTidStedTextsBokmal.arbeidstaker.outro1WithBehandler
        : endreTidStedTextsBokmal.arbeidstaker.outro1,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [endreTidStedTextsBokmal.arbeidstaker.outroObligatorisk],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      medBehandler
        ? `${
            endreTidStedTextsBokmal.arbeidstaker.outro2WithBehandler
          } ${behandlerNavn(behandler)}.`
        : endreTidStedTextsBokmal.arbeidstaker.outro2,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      medBehandler
        ? endreTidStedTextsBokmal.arbeidstaker.outro3WithBehandler
        : endreTidStedTextsBokmal.arbeidstaker.outro3,
    ],
    title: endreTidStedTextsBokmal.arbeidstaker.outro3Title,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      commonTextsBokmal.hilsen,
      veileder.fulltNavn(),
      "Nav",
      "---",
      `${
        commonTextsBokmal.brevSendt
      } ${tilDatoMedManedNavnOgKlokkeslettWithComma(sendtDato)}`,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
];

const expectedBehandlerEndringsdokument = (
  sendtDato: Date
): DocumentComponentDto[] => [
  {
    texts: ["Endret dialogmøte, svar ønskes"],
    type: DocumentComponentType.HEADER_H1,
  },
  {
    texts: [endreTidStedTextsBokmal.behandler.intro],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [`Gjelder ${arbeidstaker.navn}, f.nr. ${arbeidstaker.personident}.`],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      `${
        endreTidStedTextsBokmal.intro1
      } ${tilDatoMedManedNavnOgKlokkeslettWithComma(dialogmote.tid)}.`,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [endreTidStedTextsBokmal.intro2],
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
    texts: [commonTextsBokmal.videoMoteInfo],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [mote.arbeidsgivernavn],
    title: "Arbeidsgiver",
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [moteTekster.fritekstTilBehandler],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [endreTidStedTextsBokmal.behandler.outro],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      commonTextsBokmal.hilsen,
      veileder.fulltNavn(),
      "Nav",
      "---",
      `${
        commonTextsBokmal.brevSendt
      } ${tilDatoMedManedNavnOgKlokkeslettWithComma(sendtDato)}`,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
];

const expectedAvlysningArbeidsgiver = (
  sendtDato: Date
): DocumentComponentDto[] => [
  {
    texts: ["Avlysning av dialogmøte"],
    type: DocumentComponentType.HEADER_H1,
  },
  {
    texts: [`Gjelder ${arbeidstaker.navn}, f.nr. ${arbeidstaker.personident}.`],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      `${
        avlysningTextsBokmal.intro1
      } ${tilDatoMedManedNavnOgKlokkeslettWithComma(dialogmote.tid)}. ${
        avlysningTextsBokmal.intro2
      }`,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [moteTekster.fritekstTilArbeidsgiver],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [mote.arbeidsgivernavn],
    title: "Arbeidsgiver",
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      commonTextsBokmal.hilsen,
      veileder.fulltNavn(),
      "Nav",
      "---",
      `${
        commonTextsBokmal.brevSendt
      } ${tilDatoMedManedNavnOgKlokkeslettWithComma(sendtDato)}`,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
];

const expectedAvlysningArbeidstaker = (
  sendtDato: Date
): DocumentComponentDto[] => [
  {
    texts: ["Avlysning av dialogmøte"],
    type: DocumentComponentType.HEADER_H1,
  },
  {
    texts: [`Hei, ${arbeidstaker.navn}`],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      `${
        avlysningTextsBokmal.intro1
      } ${tilDatoMedManedNavnOgKlokkeslettWithComma(dialogmote.tid)}. ${
        avlysningTextsBokmal.intro2
      }`,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [moteTekster.fritekstTilArbeidstaker],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [mote.arbeidsgivernavn],
    title: "Arbeidsgiver",
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      commonTextsBokmal.hilsen,
      veileder.fulltNavn(),
      "Nav",
      "---",
      `${
        commonTextsBokmal.brevSendt
      } ${tilDatoMedManedNavnOgKlokkeslettWithComma(sendtDato)}`,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
];

const expectedAvlysningBehandler = (
  sendtDato: Date
): DocumentComponentDto[] => [
  {
    texts: ["Avlysning av dialogmøte"],
    type: DocumentComponentType.HEADER_H1,
  },
  {
    texts: [`Gjelder ${arbeidstaker.navn}, f.nr. ${arbeidstaker.personident}.`],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      `${
        avlysningTextsBokmal.intro1
      } ${tilDatoMedManedNavnOgKlokkeslettWithComma(dialogmote.tid)}. ${
        avlysningTextsBokmal.intro2
      }`,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [moteTekster.fritekstTilBehandler],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [mote.arbeidsgivernavn],
    title: "Arbeidsgiver",
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      commonTextsBokmal.hilsen,
      veileder.fulltNavn(),
      "Nav",
      "---",
      `${
        commonTextsBokmal.brevSendt
      } ${tilDatoMedManedNavnOgKlokkeslettWithComma(sendtDato)}`,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
];

export const expectedReferatDocument = (
  sendtDato: Date
): DocumentComponentDto[] => [
  {
    texts: [referatTextsBokmal.nyttHeader],
    type: DocumentComponentType.HEADER_H1,
  },
  {
    texts: [arbeidstaker.navn],
    type: DocumentComponentType.HEADER_H2,
  },
  {
    texts: [`F.nr. ${arbeidstaker.personident}`],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [tilDatoMedUkedagOgManedNavnOgKlokkeslett(dialogmote.tid)],
    title: commonTextsBokmal.moteTidTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [dialogmote.sted],
    title: commonTextsBokmal.moteStedTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      `${referatTextsBokmal.deltakere.arbeidstaker}: ${arbeidstaker.navn}`,
      `${referatTextsBokmal.deltakere.nav}: ${veileder.fulltNavn()}`,
      `${referatTextsBokmal.deltakere.arbeidsgiver}: ${narmesteLederNavn}`,
      `${referatTextsBokmal.deltakere.behandler}: ${behandlerNavn(behandler)}`,
      `${annenDeltakerFunksjon}: ${annenDeltakerNavn}`,
    ],
    title: referatTextsBokmal.deltakereTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [mote.arbeidsgivernavn],
    title: commonTextsBokmal.arbeidsgiverTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [referatTextsBokmal.intro1],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [referatTextsBokmal.intro2],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [referatTextsBokmal.detteSkjeddeHeader],
    type: DocumentComponentType.HEADER_H2,
  },
  {
    texts: [moteTekster.konklusjonTekst],
    title: referatTextsBokmal.konklusjonTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [moteTekster.arbeidstakersOppgave],
    title: referatTextsBokmal.arbeidstakersOppgaveTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [moteTekster.arbeidsgiversOppgave],
    title: referatTextsBokmal.arbeidsgiversOppgaveTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [moteTekster.behandlersOppgave],
    title: referatTextsBokmal.behandlersOppgave,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [moteTekster.veiledersOppgave],
    title: referatTextsBokmal.navOppgaveTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [moteTekster.situasjonTekst],
    title: referatTextsBokmal.situasjonTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      commonTextsBokmal.hilsen,
      veileder.fulltNavn(),
      "Nav",
      "---",
      `${
        commonTextsBokmal.brevSendt
      } ${tilDatoMedManedNavnOgKlokkeslettWithComma(sendtDato)}`,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
];

export const expectedEndretReferatDocument = (
  sendtDato: Date
): DocumentComponentDto[] => [
  {
    texts: [referatTextsBokmal.endretHeader],
    type: DocumentComponentType.HEADER_H1,
  },
  {
    texts: [referatTextsBokmal.endring],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [moteTekster.begrunnelseEndring],
    title: referatTextsBokmal.begrunnelseEndringTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [arbeidstaker.navn],
    type: DocumentComponentType.HEADER_H2,
  },
  {
    texts: [`F.nr. ${arbeidstaker.personident}`],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [tilDatoMedUkedagOgManedNavnOgKlokkeslett(dialogmote.tid)],
    title: commonTextsBokmal.moteTidTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [dialogmote.sted],
    title: commonTextsBokmal.moteStedTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      `${referatTextsBokmal.deltakere.arbeidstaker}: ${arbeidstaker.navn}`,
      `${referatTextsBokmal.deltakere.nav}: ${veileder.fulltNavn()}`,
      `${referatTextsBokmal.deltakere.arbeidsgiver}: ${narmesteLederNavn}`,
    ],
    title: referatTextsBokmal.deltakereTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [mote.arbeidsgivernavn],
    title: commonTextsBokmal.arbeidsgiverTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [referatTextsBokmal.intro1],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [referatTextsBokmal.intro2],
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [referatTextsBokmal.detteSkjeddeHeader],
    type: DocumentComponentType.HEADER_H2,
  },
  {
    texts: [moteTekster.konklusjonTekst],
    title: referatTextsBokmal.konklusjonTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [moteTekster.arbeidstakersOppgave],
    title: referatTextsBokmal.arbeidstakersOppgaveTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [moteTekster.arbeidsgiversOppgave],
    title: referatTextsBokmal.arbeidsgiversOppgaveTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [moteTekster.veiledersOppgave],
    title: referatTextsBokmal.navOppgaveTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [moteTekster.situasjonTekst],
    title: referatTextsBokmal.situasjonTitle,
    type: DocumentComponentType.PARAGRAPH,
  },
  {
    texts: [
      commonTextsBokmal.hilsen,
      veileder.fulltNavn(),
      "Nav",
      "---",
      `${
        commonTextsBokmal.brevSendt
      } ${tilDatoMedManedNavnOgKlokkeslettWithComma(sendtDato)}`,
    ],
    type: DocumentComponentType.PARAGRAPH,
  },
];

export const expectedInnkallingDocuments = {
  arbeidsgiver: (medBehandler = false, sendtDato: Date) =>
    expectedArbeidsgiverInnkalling(medBehandler, sendtDato),
  arbeidstaker: (medBehandler = false, sendtDato: Date) =>
    expectedArbeidstakerInnkalling(medBehandler, sendtDato),
  behandler: expectedBehandlerInnkalling,
};

export const expectedEndringDocuments = {
  arbeidsgiver: (medBehandler = false, sendtDato: Date) =>
    expectedArbeidsgiverEndringsdokument(medBehandler, sendtDato),
  arbeidstaker: (medBehandler = false, sendtDato: Date) =>
    expectedArbeidstakerEndringsdokument(medBehandler, sendtDato),
  behandler: expectedBehandlerEndringsdokument,
};

export const expectedAvlysningDocuments = {
  arbeidsgiver: expectedAvlysningArbeidsgiver,
  arbeidstaker: expectedAvlysningArbeidstaker,
  behandler: expectedAvlysningBehandler,
};
