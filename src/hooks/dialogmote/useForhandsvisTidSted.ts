import { EndreTidStedSkjemaValues } from "@/components/dialogmote/endre/EndreDialogmoteSkjema";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import {
  createLink,
  createParagraph,
  createParagraphWithTitle,
} from "@/utils/documentComponentUtils";
import {
  tilDatoMedManedNavnOgKlokkeslettWithComma,
  tilDatoMedUkedagOgManedNavnOgKlokkeslett,
} from "@/utils/datoUtils";
import { genererDato } from "../../components/mote/utils";
import { useForhandsvisningHilsen } from "./useForhandsvisningHilsen";
import {
  commonTexts,
  endreTidStedTexts,
  innkallingTexts,
} from "@/data/dialogmote/dialogmoteTexts";
import { Brukerinfo } from "@/data/navbruker/types/Brukerinfo";
import { DocumentComponentDto } from "@/data/dialogmote/types/dialogmoteTypes";

export interface ForhandsvisTidStedGenerator {
  generateArbeidsgiverTidStedDocument(
    values: Partial<EndreTidStedSkjemaValues>,
    opprinneligTid: string
  ): DocumentComponentDto[];

  generateArbeidstakerTidStedDocument(
    values: Partial<EndreTidStedSkjemaValues>,
    opprinneligTid: string
  ): DocumentComponentDto[];
}

export const useForhandsvisTidSted = (): ForhandsvisTidStedGenerator => {
  const navBruker = useNavBrukerData();
  const hilsen = useForhandsvisningHilsen();

  const generateArbeidsgiverTidStedDocument = (
    values: Partial<EndreTidStedSkjemaValues>,
    opprinneligTid: string
  ) => {
    const documentComponents = [
      arbeidsgiverIntro(navBruker),
      ...fellesInfo(values, opprinneligTid),
    ];

    if (values.begrunnelseArbeidsgiver) {
      documentComponents.push(createParagraph(values.begrunnelseArbeidsgiver));
    }

    documentComponents.push(
      createParagraph(endreTidStedTexts.arbeidsgiver.outro)
    );

    documentComponents.push(...outro);

    documentComponents.push(
      ...hilsen,
      createParagraph(
        commonTexts.arbeidsgiverTlfLabel,
        commonTexts.arbeidsgiverTlf
      )
    );

    return documentComponents;
  };

  const generateArbeidstakerTidStedDocument = (
    values: Partial<EndreTidStedSkjemaValues>,
    opprinneligTid: string
  ) => {
    const documentComponents = [
      arbeidstakerIntro(navBruker),
      ...fellesInfo(values, opprinneligTid),
    ];

    if (values.begrunnelseArbeidstaker) {
      documentComponents.push(createParagraph(values.begrunnelseArbeidstaker));
    }

    documentComponents.push(
      createParagraph(endreTidStedTexts.arbeidstaker.outro)
    );

    documentComponents.push(...outro);

    documentComponents.push(...hilsen);

    return documentComponents;
  };

  return {
    generateArbeidstakerTidStedDocument,
    generateArbeidsgiverTidStedDocument,
  };
};

const fellesInfo = (
  values: Partial<EndreTidStedSkjemaValues>,
  opprinneligTid: string
): DocumentComponentDto[] => {
  const { dato, klokkeslett, sted, videoLink } = values;

  const components = [
    createParagraph(
      `${endreTidStedTexts.intro1} ${tilDatoMedManedNavnOgKlokkeslettWithComma(
        opprinneligTid
      )}.`
    ),
    createParagraph(endreTidStedTexts.intro2),
    createParagraphWithTitle(
      endreTidStedTexts.moteTidTitle,
      dato && klokkeslett
        ? tilDatoMedUkedagOgManedNavnOgKlokkeslett(
            genererDato(dato, klokkeslett)
          )
        : ""
    ),
    createParagraphWithTitle(endreTidStedTexts.moteStedTitle, sted || ""),
  ];

  if (videoLink) {
    components.push(createLink(innkallingTexts.videoLinkTitle, videoLink));
  }

  return components;
};

const arbeidstakerIntro = (navBruker: Brukerinfo): DocumentComponentDto =>
  createParagraph(`${navBruker.navn} (f.nr ${navBruker.kontaktinfo.fnr})`);

const arbeidsgiverIntro = (navBruker: Brukerinfo): DocumentComponentDto =>
  createParagraph(
    `Gjelder ${navBruker.navn} (f.nr ${navBruker.kontaktinfo.fnr})`
  );

const outro: DocumentComponentDto[] = [
  createParagraph(endreTidStedTexts.commonOutro),
  createParagraphWithTitle(
    endreTidStedTexts.preMeetingTitle,
    endreTidStedTexts.preMeeting
  ),
];
